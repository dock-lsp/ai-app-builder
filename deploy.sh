#!/bin/bash
# AI App Builder 部署脚本 for CentOS 阿里云服务器

set -e

echo "🚀 开始部署 AI App Builder..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否以root运行
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}请使用 root 用户运行此脚本${NC}"
  exit 1
fi

# 检测系统类型
if [ -f /etc/centos-release ]; then
  OS="centos"
  echo -e "${GREEN}✓ 检测到 CentOS 系统${NC}"
elif [ -f /etc/redhat-release ]; then
  OS="centos"
  echo -e "${GREEN}✓ 检测到 RHEL/CentOS 系统${NC}"
else
  OS="ubuntu"
  echo -e "${YELLOW}检测到 Ubuntu/Debian 系统${NC}"
fi

# 安装系统依赖
echo -e "${YELLOW}📦 安装系统依赖...${NC}"
if [ "$OS" = "centos" ]; then
  # CentOS 使用 yum/dnf
  if command -v dnf &> /dev/null; then
    dnf install -y epel-release
    dnf install -y nginx git curl wget
  else
    yum install -y epel-release
    yum install -y nginx git curl wget
  fi
else
  # Ubuntu/Debian 使用 apt
  apt-get update
  apt-get install -y nginx git curl
fi

# 安装 Node.js 20
echo -e "${YELLOW}📦 安装 Node.js 20...${NC}"
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "20" ]; then
  if [ "$OS" = "centos" ]; then
    # CentOS 安装 Node.js
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    if command -v dnf &> /dev/null; then
      dnf install -y nodejs
    else
      yum install -y nodejs
    fi
  else
    # Ubuntu 安装 Node.js
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  fi
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
echo -e "${GREEN}✓ npm 版本: $(npm -v)${NC}"

# 创建应用目录
APP_DIR="/var/www/ai-app-builder"
echo -e "${YELLOW}📁 创建应用目录: $APP_DIR${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# 克隆代码（如果目录为空）
if [ -z "$(ls -A $APP_DIR 2>/dev/null | grep -v '^logs$')" ]; then
  echo -e "${YELLOW}📥 克隆代码...${NC}"
  git clone https://github.com/dock-lsp/ai-app-builder.git .
else
  echo -e "${YELLOW}🔄 更新代码...${NC}"
  git pull origin main || git fetch origin main
fi

# 安装依赖
echo -e "${YELLOW}📦 安装项目依赖...${NC}"
npm ci || npm install

# 构建前端
echo -e "${YELLOW}🔨 构建前端...${NC}"
npm run build

# 安装 PM2 和 tsx
echo -e "${YELLOW}📦 安装 PM2 和 tsx...${NC}"
npm install -g pm2 tsx

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ai-app-builder-api',
      script: './server/index.ts',
      interpreter: 'tsx',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOF

# 创建日志目录
mkdir -p logs

# 启动/重启后端服务
echo -e "${YELLOW}🚀 启动后端服务...${NC}"
pm2 delete ai-app-builder-api 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# 配置 PM2 开机自启
echo -e "${YELLOW}⚙️ 配置 PM2 开机自启...${NC}"
pm2 startup systemd 2>/dev/null || true

# 配置 Nginx
echo -e "${YELLOW}🔧 配置 Nginx...${NC}"

if [ "$OS" = "centos" ]; then
  # CentOS Nginx 配置路径
  NGINX_CONF="/etc/nginx/conf.d/ai-app-builder.conf"
  
  cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location / {
        root /var/www/ai-app-builder/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

  # 移除默认配置中的冲突
  sed -i 's/listen       80;/listen       80 default_server;/' /etc/nginx/nginx.conf 2>/dev/null || true
  
else
  # Ubuntu Nginx 配置路径
  cat > /etc/nginx/sites-available/ai-app-builder << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/ai-app-builder/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

  ln -sf /etc/nginx/sites-available/ai-app-builder /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default
fi

# 测试 Nginx 配置
nginx -t

# 启动/重启 Nginx
echo -e "${YELLOW}🔄 重启 Nginx...${NC}"
if [ "$OS" = "centos" ]; then
  systemctl enable nginx
  systemctl restart nginx
else
  systemctl restart nginx
  systemctl enable nginx
fi

# 配置防火墙
echo -e "${YELLOW}🔒 配置防火墙...${NC}"
if [ "$OS" = "centos" ]; then
  # CentOS 使用 firewalld
  if systemctl is-active --quiet firewalld; then
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --reload
    echo -e "${GREEN}✓ firewalld 已开放 80/443 端口${NC}"
  else
    echo -e "${YELLOW}firewalld 未运行，跳过防火墙配置${NC}"
  fi
else
  # Ubuntu 使用 ufw
  if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable 2>/dev/null || true
  fi
fi

# 获取公网IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ip.sb 2>/dev/null || echo "YOUR_SERVER_IP")

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}🌐 应用访问地址: http://${PUBLIC_IP}${NC}"
echo -e "${GREEN}📊 后端服务状态:${NC}"
pm2 list 2>/dev/null | grep ai-app-builder-api || pm2 status
echo ""
echo -e "${YELLOW}📋 常用命令:${NC}"
echo "  查看日志: pm2 logs ai-app-builder-api"
echo "  重启服务: pm2 restart ai-app-builder-api"
echo "  更新代码: cd $APP_DIR && git pull && npm run build && pm2 restart ai-app-builder-api"
echo ""
echo -e "${YELLOW}🔐 测试账号:${NC}"
echo "  邮箱: demo@aiappbuilder.com"
echo "  密码: demo123"

#!/bin/bash
# AI App Builder 部署脚本 for 阿里云服务器

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

# 安装依赖
echo -e "${YELLOW}📦 安装系统依赖...${NC}"
apt-get update
apt-get install -y nginx git curl

# 安装 Node.js 20
echo -e "${YELLOW}📦 安装 Node.js 20...${NC}"
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "20" ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"
echo -e "${GREEN}✓ npm 版本: $(npm -v)${NC}"

# 创建应用目录
APP_DIR="/var/www/ai-app-builder"
echo -e "${YELLOW}📁 创建应用目录: $APP_DIR${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# 克隆代码（如果目录为空）
if [ -z "$(ls -A $APP_DIR)" ]; then
  echo -e "${YELLOW}📥 克隆代码...${NC}"
  git clone https://github.com/dock-lsp/ai-app-builder.git .
else
  echo -e "${YELLOW}🔄 更新代码...${NC}"
  git pull origin main
fi

# 安装依赖
echo -e "${YELLOW}📦 安装项目依赖...${NC}"
npm ci

# 构建前端
echo -e "${YELLOW}🔨 构建前端...${NC}"
npm run build

# 安装 PM2
echo -e "${YELLOW}📦 安装 PM2...${NC}"
npm install -g pm2

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

# 配置 Nginx
echo -e "${YELLOW}🔧 配置 Nginx...${NC}"
cat > /etc/nginx/sites-available/ai-app-builder << 'EOF'
server {
    listen 80;
    server_name _;  # 接受所有域名

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

# 启用站点
ln -sf /etc/nginx/sites-available/ai-app-builder /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx
systemctl enable nginx

# 配置防火墙
echo -e "${YELLOW}🔒 配置防火墙...${NC}"
if command -v ufw &> /dev/null; then
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
fi

echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}🌐 应用访问地址: http://$(curl -s ifconfig.me)${NC}"
echo -e "${GREEN}📊 PM2 状态: $(pm2 list | grep ai-app-builder-api | awk '{print $10}')${NC}"
echo ""
echo -e "${YELLOW}📋 常用命令:${NC}"
echo "  查看日志: pm2 logs ai-app-builder-api"
echo "  重启服务: pm2 restart ai-app-builder-api"
echo "  更新代码: cd $APP_DIR && git pull && npm run build && pm2 restart ai-app-builder-api"

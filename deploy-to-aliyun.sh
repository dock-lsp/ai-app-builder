#!/bin/bash
# AI App Builder 阿里云自动部署脚本
# 使用方法: ./deploy-to-aliyun.sh

set -e

# 配置
SERVER_IP="47.92.220.102"
SERVER_USER="root"
SERVER_PASS="mm900236.."
DEPLOY_DIR="/opt/ai-app-builder"
GITHUB_REPO="https://github.com/dock-lsp/ai-app-builder.git"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始部署 AI App Builder 到阿里云...${NC}"

# 安装 sshpass（如果没有）
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}📦 安装 sshpass...${NC}"
    apt-get update && apt-get install -y sshpass || brew install sshpass || true
fi

# 连接服务器并执行部署命令
echo -e "${GREEN}🔌 连接服务器 ${SERVER_IP}...${NC}"

sshpass -p "${SERVER_PASS}" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=30 ${SERVER_USER}@${SERVER_IP} << 'REMOTE_SCRIPT'

set -e

echo "📝 更新系统..."
apt-get update -qq

echo "🐳 安装 Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

echo "📦 安装 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

echo "🌐 安装 Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

echo "📥 克隆/更新代码..."
if [ -d "/opt/ai-app-builder" ]; then
    cd /opt/ai-app-builder
    git pull
else
    git clone https://github.com/dock-lsp/ai-app-builder.git /opt/ai-app-builder
    cd /opt/ai-app-builder
fi

echo "⚙️ 配置环境变量..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=ai-app-builder-secret-$(date +%s)

# 阿里云百炼 API
DEEPSEEK_API_KEY=sk-e511f943447849769e588927c03fcffe

# 智谱 AI API
ZHIPU_API_KEY=ffc0a7122a47493da48fa7991c85c82a.vrqLJPIzPuhwk3tB
EOF

echo "🚀 启动服务..."
docker-compose down 2>/dev/null || true
docker-compose up -d --build

echo "🔥 配置防火墙..."
ufw allow 22/tcp 2>/dev/null || true
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true
ufw allow 3001/tcp 2>/dev/null || true
ufw --force enable 2>/dev/null || true

echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址:"
echo "  - 前端: http://$(curl -s ip.sb):4173"
echo "  - API:  http://$(curl -s ip.sb):3001"
echo ""
echo "📊 查看状态: docker-compose ps"
echo "📜 查看日志: docker-compose logs -f"

REMOTE_SCRIPT

echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "🌐 应用访问地址:"
echo "  http://${SERVER_IP}:4173"
echo ""
echo "📊 管理命令:"
echo "  ssh root@${SERVER_IP}"
echo "  cd /opt/ai-app-builder && docker-compose logs -f"

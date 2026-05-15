# 🚀 阿里云服务器部署指南

## 📋 部署前准备

### 服务器要求
- **系统**: Ubuntu 20.04/22.04 LTS
- **内存**: 至少 2GB RAM
- **磁盘**: 至少 10GB 可用空间
- **网络**: 开放 80 端口 (HTTP)

### 服务器信息
- **IP**: 47.92.220.102
- **用户名**: root
- **密码**: mm900236..

---

## 🔧 部署步骤

### 1. 连接服务器

```bash
ssh root@47.92.220.102
# 密码: mm900236..
```

### 2. 一键部署脚本

连接服务器后，执行以下命令：

```bash
# 下载部署脚本
curl -fsSL https://raw.githubusercontent.com/dock-lsp/ai-app-builder/main/deploy.sh -o /tmp/deploy.sh

# 执行部署
chmod +x /tmp/deploy.sh
/tmp/deploy.sh
```

### 3. 手动部署（备用方案）

如果一键脚本失败，可以手动执行：

```bash
# 1. 安装依赖
apt-get update
apt-get install -y nginx git curl

# 2. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. 创建应用目录
mkdir -p /var/www/ai-app-builder
cd /var/www/ai-app-builder

# 4. 克隆代码
git clone https://github.com/dock-lsp/ai-app-builder.git .

# 5. 安装依赖
npm ci

# 6. 构建
npm run build

# 7. 安装 PM2
npm install -g pm2 tsx

# 8. 启动后端
pm2 start --name ai-app-builder-api --interpreter tsx ./server/index.ts
pm2 save
pm2 startup

# 9. 配置 Nginx
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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    gzip on;
}
EOF

ln -sf /etc/nginx/sites-available/ai-app-builder /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

## ✅ 部署验证

部署完成后，访问以下地址验证：

- **Web应用**: http://47.92.220.102
- **API健康检查**: http://47.92.220.102/api/health

### 测试账号
- **邮箱**: demo@aiappbuilder.com
- **密码**: demo123

---

## 🔄 更新应用

当代码有更新时，执行：

```bash
cd /var/www/ai-app-builder
git pull origin main
npm ci
npm run build
pm2 restart ai-app-builder-api
```

---

## 📊 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs ai-app-builder-api

# 重启应用
pm2 restart ai-app-builder-api

# 停止应用
pm2 stop ai-app-builder-api

# 查看 Nginx 状态
systemctl status nginx

# 重启 Nginx
systemctl restart nginx
```

---

## 🛠️ 故障排查

### 1. 无法访问网站
```bash
# 检查 Nginx 是否运行
systemctl status nginx

# 检查防火墙
ufw status
ufw allow 80/tcp

# 检查端口监听
netstat -tlnp | grep :80
```

### 2. API 无法连接
```bash
# 检查后端服务
pm2 status
pm2 logs ai-app-builder-api

# 检查端口 3001
netstat -tlnp | grep :3001
```

### 3. 前端显示 404
```bash
# 检查 dist 目录是否存在
ls -la /var/www/ai-app-builder/dist/

# 重新构建
npm run build
```

---

## 🔒 安全配置（可选）

### 配置 HTTPS (Let's Encrypt)

```bash
# 安装 Certbot
apt-get install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

### 配置防火墙

```bash
# 允许 SSH
ufw allow 22/tcp

# 允许 HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 启用防火墙
ufw --force enable
```

---

## 📞 技术支持

如遇问题，请检查：
1. 服务器是否正常运行
2. 端口 80 是否开放
3. Nginx 配置是否正确
4. PM2 进程是否正常运行

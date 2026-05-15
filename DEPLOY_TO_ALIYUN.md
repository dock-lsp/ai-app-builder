# 🚀 阿里云服务器部署指南 (CentOS)

## 📋 部署前准备

### 服务器要求
- **系统**: CentOS 7/8 或 Ubuntu 20.04/22.04 LTS
- **内存**: 至少 2GB RAM
- **磁盘**: 至少 10GB 可用空间
- **网络**: 开放 80 端口 (HTTP)

### 服务器信息
- **IP**: 47.92.220.102
- **系统**: CentOS
- **用户名**: root
- **密码**: mm900236..

---

## 🔧 快速部署（推荐）

### 1. 连接服务器

```bash
ssh root@47.92.220.102
# 密码: mm900236..
```

### 2. 一键部署

连接服务器后，执行以下命令：

```bash
# 下载并执行部署脚本
curl -fsSL https://raw.githubusercontent.com/dock-lsp/ai-app-builder/main/deploy.sh -o /tmp/deploy.sh
chmod +x /tmp/deploy.sh
/tmp/deploy.sh
```

脚本会自动：
- ✅ 检测系统类型（CentOS/Ubuntu）
- ✅ 安装 Node.js 20
- ✅ 安装 Nginx
- ✅ 克隆代码
- ✅ 构建前端
- ✅ 启动后端服务（PM2）
- ✅ 配置 Nginx 反向代理
- ✅ 配置防火墙

---

## 📝 手动部署（CentOS）

如果一键脚本失败，可以手动执行：

### 1. 安装系统依赖

```bash
# CentOS 7
yum install -y epel-release
yum install -y nginx git curl wget

# CentOS 8 / Rocky Linux
dnf install -y epel-release
dnf install -y nginx git curl wget
```

### 2. 安装 Node.js 20

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs   # CentOS 7
# 或
dnf install -y nodejs   # CentOS 8
```

### 3. 克隆代码

```bash
mkdir -p /var/www/ai-app-builder
cd /var/www/ai-app-builder
git clone https://github.com/dock-lsp/ai-app-builder.git .
```

### 4. 安装依赖并构建

```bash
npm ci
npm run build
```

### 5. 启动后端服务

```bash
npm install -g pm2 tsx
pm2 start --name ai-app-builder-api --interpreter tsx ./server/index.ts
pm2 save
pm2 startup systemd
```

### 6. 配置 Nginx

```bash
cat > /etc/nginx/conf.d/ai-app-builder.conf << 'EOF'
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

# 启动 Nginx
systemctl enable nginx
systemctl restart nginx
```

### 7. 配置防火墙（CentOS）

```bash
# 使用 firewalld
systemctl start firewalld
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload

# 或使用 iptables
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
service iptables save
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

# 检查端口监听
netstat -tlnp | grep :80

# 检查防火墙（CentOS）
firewall-cmd --list-ports
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
cd /var/www/ai-app-builder
npm run build
```

### 4. SELinux 问题（CentOS）

```bash
# 临时关闭 SELinux
setenforce 0

# 永久关闭（需重启）
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

---

## 🔒 安全配置（可选）

### 配置 HTTPS (Let's Encrypt)

```bash
# CentOS 安装 Certbot
yum install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d your-domain.com

# 自动续期
crontab -e
# 添加: 0 0 * * * /usr/bin/certbot renew --quiet
```

---

## 📞 技术支持

如遇问题，请检查：
1. 服务器是否正常运行
2. 端口 80 是否开放
3. Nginx 配置是否正确
4. PM2 进程是否正常运行
5. SELinux 是否影响（CentOS）

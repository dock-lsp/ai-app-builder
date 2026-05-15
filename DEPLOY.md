# AI App Builder 部署指南

## 一、阿里云服务器准备

### 1. 服务器配置要求
| 配置项 | 最低配置 | 推荐配置 |
|--------|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 磁盘 | 40GB SSD | 100GB SSD |
| 带宽 | 3Mbps | 5Mbps |
| 系统 | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### 2. 需要准备的资源
- [ ] 阿里云 ECS 服务器（已购买）
- [ ] 域名（可选，推荐配置）
- [ ] SSL 证书（可选，Let's Encrypt 免费）
- [ ] 备案（如果使用国内域名）

---

## 二、服务器环境安装

### 1. 连接服务器
```bash
ssh root@你的服务器IP
```

### 2. 安装 Docker
```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker
systemctl enable docker
systemctl start docker

# 安装 Docker Compose
apt install -y docker-compose

# 验证
docker --version
docker-compose --version
```

### 3. 安装 Nginx
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

---

## 三、项目部署

### 1. 克隆代码
```bash
cd /opt
git clone https://github.com/dock-lsp/ai-app-builder.git
cd ai-app-builder
```

### 2. 配置环境变量
```bash
cp .env.example .env
nano .env
```

编辑 `.env` 文件：
```env
# 必须修改！
JWT_SECRET=你的随机密钥（至少32位随机字符串）

# AI 模型 API Key（可选，根据你配置的模型填写）
DEEPSEEK_API_KEY=sk-xxx
OPENAI_API_KEY=sk-xxx

# 服务器配置
PORT=3001
NODE_ENV=production

# 数据库（可选，默认使用内存存储）
# DATABASE_URL=postgresql://user:password@localhost:5432/aiappbuilder
```

### 3. Docker 部署
```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 4. Nginx 反向代理配置
```bash
nano /etc/nginx/sites-available/ai-app-builder
```

添加配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 修改为你的域名

    # 前端静态文件
    location / {
        root /opt/ai-app-builder/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        client_max_body_size 10m;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}
```

启用配置：
```bash
ln -s /etc/nginx/sites-available/ai-app-builder /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 四、SSL 证书配置（HTTPS）

### 使用 Let's Encrypt 免费证书
```bash
apt install -y certbot python3-certbot-nginx

# 申请证书（替换为你的域名）
certbot --nginx -d your-domain.com

# 自动续期测试
certbot renew --dry-run
```

---

## 五、防火墙配置

```bash
# 开放端口
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3001/tcp  # API（如需直接访问）

# 启用防火墙
ufw enable
```

---

## 六、服务管理

### 常用命令
```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启服务
docker-compose restart

# 更新代码后重新部署
git pull
docker-compose up -d --build

# 备份数据
tar -czvf backup-$(date +%Y%m%d).tar.gz /opt/ai-app-builder/data
```

---

## 七、监控与维护

### 1. 安装 PM2（可选，用于进程管理）
```bash
npm install -g pm2

# 创建 ecosystem.config.js
pm2 startup
pm2 save
```

### 2. 日志轮转
```bash
# 安装 logrotate
apt install -y logrotate

# 配置
nano /etc/logrotate.d/ai-app-builder
```

```
/opt/ai-app-builder/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
```

---

## 八、故障排查

### 1. 服务无法启动
```bash
# 检查端口占用
netstat -tlnp | grep 3001

# 检查 Docker 日志
docker-compose logs app

# 检查 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

### 2. API 无法访问
```bash
# 测试后端
curl http://localhost:3001/api/health

# 测试通过 Nginx
curl http://your-domain.com/api/health
```

### 3. 前端白屏
```bash
# 检查 dist 目录是否存在
ls -la /opt/ai-app-builder/dist/

# 检查 Nginx 配置
nginx -t
```

---

## 九、更新维护

### 自动更新脚本
```bash
#!/bin/bash
# /opt/update.sh

cd /opt/ai-app-builder
git pull
docker-compose up -d --build
docker system prune -f
```

```bash
chmod +x /opt/update.sh

# 添加定时任务（每周日凌晨3点更新）
crontab -e
0 3 * * 0 /opt/update.sh >> /var/log/update.log 2>&1
```

---

## 十、安全建议

1. **修改默认端口**：将 SSH 端口改为非 22 端口
2. **禁用 root 登录**：创建普通用户，使用 sudo
3. **定期更新**：`apt update && apt upgrade -y`
4. **备份数据**：定期备份到 OSS 或其他存储
5. **监控告警**：配置阿里云云监控

---

## 快速启动脚本

一键部署命令：
```bash
#!/bin/bash
# 保存为 deploy.sh 在服务器上执行

apt update
apt install -y docker.io docker-compose nginx git

cd /opt
git clone https://github.com/dock-lsp/ai-app-builder.git
cd ai-app-builder

cp .env.example .env
# 手动编辑 .env 文件配置 JWT_SECRET

docker-compose up -d --build

echo "部署完成！访问 http://$(curl -s ip.sb):4173"
```

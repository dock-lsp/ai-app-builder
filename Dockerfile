FROM node:20-alpine AS builder

WORKDIR /app

# 安装前端依赖
COPY package.json package-lock.json* ./
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npm run build

# ========== 生产阶段 ==========
FROM node:20-alpine AS production

WORKDIR /app

# 安装生产依赖
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm install pm2 -g

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 复制服务端代码
COPY server ./server
COPY tsconfig.json ./

# 复制 Vite 配置（用于 API 代理）
COPY vite.config.ts ./

# 环境变量
ENV NODE_ENV=production
ENV PORT=3001
ENV JWT_SECRET=change-this-to-a-random-secret-in-production

EXPOSE 3001 4173

# 启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

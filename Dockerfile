FROM node:20-alpine

WORKDIR /app

# 复制 package.json 并安装所有依赖
COPY package.json package-lock.json* ./
RUN npm ci

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 环境变量
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001 4173

# 启动命令：同时运行后端 API 和前端静态服务
CMD npx tsx server/index.ts & npx serve dist -l 4173 & wait

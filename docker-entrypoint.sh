#!/bin/sh
set -e

echo "🚀 Starting AI App Builder..."

# 启动后端 API 服务器
echo "📡 Starting API server on port 3001..."
cd /app && npx tsx server/index.ts &
API_PID=$!

# 启动前端静态服务
echo "🌐 Starting frontend server on port 4173..."
cd /app && npx serve dist -l 4173 &
FRONT_PID=$!

# 等待服务启动
sleep 3

echo "✅ AI App Builder is running!"
echo "   Frontend: http://localhost:4173"
echo "   API:      http://localhost:3001"

# 保持容器运行
wait $API_PID $FRONT_PID

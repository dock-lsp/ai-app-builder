import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.js';
import { projectRouter } from './routes/project.js';
import { subscriptionRouter } from './routes/subscription.js';
import { paymentRouter } from './routes/payment.js';
import { aiRouter } from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// 路由
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/ai', aiRouter);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 全局错误处理
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI App Builder API Server running on http://localhost:${PORT}`);
});

export default app;

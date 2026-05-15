import { Router, Request, Response } from 'express';
import { getUserSubscription, createSubscription, cancelSubscription } from '../models/store.js';
import { authMiddleware } from '../middleware/index.js';

export const subscriptionRouter = Router();

subscriptionRouter.use(authMiddleware);

// 会员计划配置
const PLANS = {
  free: {
    name: '免费版',
    price: 0,
    maxProjects: 3,
    maxComponents: 20,
    features: [
      '基础组件库',
      '3个项目',
      '每个项目最多20个组件',
      '社区模板',
      '基础预览',
    ],
  },
  pro: {
    name: '专业版',
    price: 29,
    maxProjects: 50,
    maxComponents: 200,
    features: [
      '全部组件库',
      '50个项目',
      '每个项目最多200个组件',
      '全部高级模板',
      'React Native 代码导出',
      'AI 智能生成',
      '优先客服支持',
    ],
  },
  enterprise: {
    name: '企业版',
    price: 99,
    maxProjects: -1, // 无限
    maxComponents: -1, // 无限
    features: [
      '全部组件库',
      '无限项目',
      '无限组件',
      '全部高级模板',
      '代码导出 + 自定义模板',
      'AI 智能生成 + 批量操作',
      '团队协作',
      'API 接入',
      '专属客服',
      '私有化部署支持',
    ],
  },
};

// 获取所有计划
subscriptionRouter.get('/plans', (_req: Request, res: Response) => {
  res.json({ success: true, data: PLANS });
});

// 获取当前订阅状态
subscriptionRouter.get('/current', (req: Request, res: Response) => {
  const user = (req as any).user;
  const subscription = getUserSubscription(user.userId);

  res.json({
    success: true,
    data: subscription || {
      plan: 'free',
      status: 'active',
      endDate: null,
    },
  });
});

// 创建订阅
subscriptionRouter.post('/create', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { plan, paymentMethod } = req.body;

  if (!plan || !['pro', 'enterprise'].includes(plan)) {
    res.status(400).json({ success: false, message: '无效的订阅计划' });
    return;
  }

  const planConfig = PLANS[plan as keyof typeof PLANS];
  const subscription = createSubscription(user.userId, {
    plan: plan as 'pro' | 'enterprise',
    amount: planConfig.price,
    paymentMethod: paymentMethod || 'wechat',
  });

  res.json({
    success: true,
    message: '订阅成功',
    data: subscription,
  });
});

// 取消订阅
subscriptionRouter.post('/cancel/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const success = cancelSubscription(req.params.id, user.userId);

  if (!success) {
    res.status(404).json({ success: false, message: '订阅不存在' });
    return;
  }

  res.json({ success: true, message: '订阅已取消' });
});

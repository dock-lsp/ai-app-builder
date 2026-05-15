import { Router, Request, Response } from 'express';
import crypto from 'crypto';

export const paymentRouter = Router();

// 生成支付订单（模拟微信支付）
paymentRouter.post('/create-order', (req: Request, res: Response) => {
  const { plan, paymentMethod } = req.body;

  if (!plan || !['pro', 'enterprise'].includes(plan)) {
    res.status(400).json({ success: false, message: '无效的订阅计划' });
    return;
  }

  const prices: Record<string, number> = {
    pro: 2900, // 29元 = 2900分
    enterprise: 9900, // 99元 = 9900分
  };

  const orderId = `ORDER-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;

  // 模拟微信支付参数
  const orderData = {
    orderId,
    amount: prices[plan],
    plan,
    paymentMethod: paymentMethod || 'wechat',
    // 模拟微信支付参数
    wechatPayParams: {
      appId: 'wx_demo_app_id',
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: crypto.randomBytes(16).toString('hex'),
      package: `prepay_id=wx_${crypto.randomBytes(16).toString('hex')}`,
      signType: 'RSA',
      paySign: crypto.randomBytes(32).toString('hex'),
    },
    // 模拟支付宝参数
    alipayParams: {
      tradeNo: orderId,
      totalAmount: (prices[plan] / 100).toFixed(2),
      subject: `AI App Builder ${plan === 'pro' ? '专业版' : '企业版'}会员`,
    },
    createdAt: new Date().toISOString(),
    expireAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟过期
  };

  res.json({
    success: true,
    message: '订单创建成功',
    data: orderData,
  });
});

// 模拟支付回调（开发环境使用）
paymentRouter.post('/simulate-callback', (req: Request, res: Response) => {
  const { orderId, status } = req.body;

  // 模拟支付成功
  res.json({
    success: true,
    message: status === 'success' ? '支付成功' : '支付失败',
    data: {
      orderId,
      status: status || 'success',
      transactionId: `TXN-${crypto.randomBytes(16).toString('hex')}`,
      paidAt: new Date().toISOString(),
    },
  });
});

// 查询订单状态
paymentRouter.get('/order/:orderId', (req: Request, res: Response) => {
  // 模拟返回订单状态
  res.json({
    success: true,
    data: {
      orderId: req.params.orderId,
      status: 'paid',
      paidAt: new Date().toISOString(),
    },
  });
});

// 退款
paymentRouter.post('/refund', (req: Request, res: Response) => {
  const { orderId, reason } = req.body;

  res.json({
    success: true,
    message: '退款申请已提交',
    data: {
      orderId,
      refundId: `REFUND-${crypto.randomBytes(16).toString('hex')}`,
      status: 'processing',
      reason: reason || '用户申请退款',
      estimatedTime: '1-3个工作日',
    },
  });
});

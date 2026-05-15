import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: '未登录，请先登录' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ success: false, message: '登录已过期，请重新登录' });
    return;
  }

  (req as any).user = payload;
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      (req as any).user = payload;
    }
  }
  
  next();
}

export function requirePlan(...plans: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ success: false, message: '未登录' });
      return;
    }

    if (!plans.includes(user.plan)) {
      res.status(403).json({
        success: false,
        message: `此功能需要 ${plans.join('/')} 会员`,
        requiredPlan: plans[0],
      });
      return;
    }

    next();
  };
}

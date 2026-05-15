import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, updateUser } from '../models/store.js';
import { generateToken, JwtPayload } from '../middleware/auth.js';

export const authRouter = Router();

// 注册
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: '邮箱和密码不能为空' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: '密码至少6位' });
      return;
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ success: false, message: '该邮箱已被注册' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({
      email,
      password: hashedPassword,
      nickname: nickname || email.split('@')[0],
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      plan: user.plan,
    };

    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          plan: user.plan,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 登录
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: '邮箱和密码不能为空' });
      return;
    }

    const user = getUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: '邮箱或密码错误' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ success: false, message: '邮箱或密码错误' });
      return;
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      plan: user.plan,
    };

    const token = generateToken(payload);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          avatar: user.avatar,
          plan: user.plan,
          planExpireAt: user.planExpireAt,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取当前用户信息
authRouter.get('/me', (req: Request, res: Response) => {
  // 由 authMiddleware 处理
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ success: false, message: '未登录' });
    return;
  }

  const fullUser = getUserById(user.userId);
  if (!fullUser) {
    res.status(404).json({ success: false, message: '用户不存在' });
    return;
  }

  res.json({
    success: true,
    data: {
      id: fullUser.id,
      email: fullUser.email,
      nickname: fullUser.nickname,
      avatar: fullUser.avatar,
      plan: fullUser.plan,
      planExpireAt: fullUser.planExpireAt,
      createdAt: fullUser.createdAt,
    },
  });
});

// 更新用户信息
authRouter.put('/profile', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ success: false, message: '未登录' });
    return;
  }

  const { nickname, avatar } = req.body;
  const updated = updateUser(user.userId, { nickname, avatar });

  if (!updated) {
    res.status(404).json({ success: false, message: '用户不存在' });
    return;
  }

  res.json({
    success: true,
    message: '更新成功',
    data: {
      id: updated.id,
      email: updated.email,
      nickname: updated.nickname,
      avatar: updated.avatar,
      plan: updated.plan,
    },
  });
});

// 修改密码
authRouter.put('/password', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, message: '未登录' });
      return;
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ success: false, message: '旧密码和新密码不能为空' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: '新密码至少6位' });
      return;
    }

    const fullUser = getUserById(user.userId);
    if (!fullUser) {
      res.status(404).json({ success: false, message: '用户不存在' });
      return;
    }

    const isValid = await bcrypt.compare(oldPassword, fullUser.password);
    if (!isValid) {
      res.status(400).json({ success: false, message: '旧密码错误' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateUser(user.userId, { password: hashedPassword });

    res.json({ success: true, message: '密码修改成功' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

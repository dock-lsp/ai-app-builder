import { Router, Request, Response } from 'express';
import { createProject, getProjectById, getUserProjects, updateProject, deleteProject } from '../models/store.js';
import { authMiddleware, requirePlan } from '../middleware/index.js';

export const projectRouter = Router();

// 所有项目路由都需要登录
projectRouter.use(authMiddleware);

// 获取用户项目列表
projectRouter.get('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const projects = getUserProjects(user.userId);
  
  // 返回项目列表（不含完整组件数据，减少传输量）
  const projectList = projects.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    thumbnail: p.thumbnail,
    componentCount: p.components.length,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  res.json({
    success: true,
    data: projectList,
  });
});

// 获取单个项目详情
projectRouter.get('/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const project = getProjectById(req.params.id);

  if (!project || project.userId !== user.userId) {
    res.status(404).json({ success: false, message: '项目不存在' });
    return;
  }

  res.json({ success: true, data: project });
});

// 创建项目
projectRouter.post('/', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, description, components } = req.body;

  if (!name) {
    res.status(400).json({ success: false, message: '项目名称不能为空' });
    return;
  }

  // 免费用户最多3个项目
  const existingProjects = getUserProjects(user.userId);
  if (user.plan === 'free' && existingProjects.length >= 3) {
    res.status(403).json({
      success: false,
      message: '免费用户最多创建3个项目，请升级会员',
      upgradeRequired: true,
    });
    return;
  }

  const project = createProject(user.userId, {
    name,
    description: description || '',
    components: components || [],
  });

  res.status(201).json({
    success: true,
    message: '项目创建成功',
    data: project,
  });
});

// 更新项目
projectRouter.put('/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, description, components, thumbnail } = req.body;

  const project = updateProject(req.params.id, user.userId, {
    name,
    description,
    components,
    thumbnail,
  });

  if (!project) {
    res.status(404).json({ success: false, message: '项目不存在' });
    return;
  }

  res.json({
    success: true,
    message: '保存成功',
    data: project,
  });
});

// 删除项目
projectRouter.delete('/:id', (req: Request, res: Response) => {
  const user = (req as any).user;
  const success = deleteProject(req.params.id, user.userId);

  if (!success) {
    res.status(404).json({ success: false, message: '项目不存在' });
    return;
  }

  res.json({ success: true, message: '项目已删除' });
});

// 导出项目（Pro 功能）
projectRouter.post('/:id/export', requirePlan('pro', 'enterprise'), (req: Request, res: Response) => {
  const user = (req as any).user;
  const project = getProjectById(req.params.id);

  if (!project || project.userId !== user.userId) {
    res.status(404).json({ success: false, message: '项目不存在' });
    return;
  }

  res.json({
    success: true,
    data: {
      components: project.components,
      exportTime: new Date().toISOString(),
    },
  });
});

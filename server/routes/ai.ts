import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/index.js';
import { getAllProviders, getProviderById, UserProviderConfig, AIModelProvider } from '../services/aiProviders.js';
import { callAI } from '../services/aiService.js';

export const aiRouter = Router();

aiRouter.use(authMiddleware);

// ========== 用户 AI 配置存储（内存，生产环境用数据库） ==========
const userProviderConfigs: Map<string, UserProviderConfig[]> = new Map();

function getUserConfigs(userId: string): UserProviderConfig[] {
  return userProviderConfigs.get(userId) || [];
}

function setUserConfigs(userId: string, configs: UserProviderConfig[]) {
  userProviderConfigs.set(userId, configs);
}

// ========== 提供商列表 ==========

// 获取所有可用提供商
aiRouter.get('/providers', (_req: Request, res: Response) => {
  const providers = getAllProviders().map(p => ({
    id: p.id,
    name: p.name,
    nameEn: p.nameEn,
    description: p.description,
    icon: p.icon,
    color: p.color,
    category: p.category,
    modelCount: p.models.length,
    models: p.models.map(m => ({ id: m.id, name: m.name, maxTokens: m.maxTokens })),
    configFields: p.configFields,
    isBuiltIn: p.isBuiltIn,
  }));
  res.json({ success: true, data: providers });
});

// ========== 用户配置管理 ==========

// 获取用户的 AI 配置
aiRouter.get('/config', (req: Request, res: Response) => {
  const user = (req as any).user;
  const configs = getUserConfigs(user.userId);
  res.json({ success: true, data: configs });
});

// 保存用户的 AI 配置
aiRouter.put('/config', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { configs } = req.body;

  if (!Array.isArray(configs)) {
    res.status(400).json({ success: false, message: 'configs 必须是数组' });
    return;
  }

  // 验证每个配置
  const validatedConfigs = configs.map((c: any) => {
    const provider = getProviderById(c.providerId);
    if (!provider) {
      throw new Error(`未知提供商: ${c.providerId}`);
    }
    return {
      providerId: c.providerId,
      apiKey: c.apiKey || '',
      apiBase: c.apiBase || undefined,
      customModel: c.customModel || undefined,
      enabled: c.enabled ?? true,
      isDefault: c.isDefault ?? false,
    };
  });

  setUserConfigs(user.userId, validatedConfigs);
  res.json({ success: true, message: '配置已保存' });
});

// 添加/更新单个提供商配置
aiRouter.post('/config/provider', (req: Request, res: Response) => {
  const user = (req as any).user;
  const { providerId, apiKey, apiBase, customModel, enabled, isDefault } = req.body;

  if (!providerId) {
    res.status(400).json({ success: false, message: 'providerId 不能为空' });
    return;
  }

  // 支持自定义提供商
  if (!getProviderById(providerId) && !apiBase) {
    res.status(400).json({ success: false, message: '自定义提供商需要提供 apiBase' });
    return;
  }

  const configs = getUserConfigs(user.userId);
  const existingIndex = configs.findIndex(c => c.providerId === providerId);

  const newConfig: UserProviderConfig = {
    providerId,
    apiKey: apiKey || '',
    apiBase,
    customModel,
    enabled: enabled ?? true,
    isDefault: isDefault ?? false,
  };

  if (existingIndex >= 0) {
    configs[existingIndex] = newConfig;
  } else {
    configs.push(newConfig);
  }

  // 如果设为默认，取消其他默认
  if (newConfig.isDefault) {
    configs.forEach(c => { if (c.providerId !== providerId) c.isDefault = false; });
  }

  setUserConfigs(user.userId, configs);
  res.json({ success: true, message: '配置已保存', data: newConfig });
});

// 删除提供商配置
aiRouter.delete('/config/provider/:providerId', (req: Request, res: Response) => {
  const user = (req as any).user;
  const configs = getUserConfigs(user.userId);
  const filtered = configs.filter(c => c.providerId !== req.params.providerId);
  setUserConfigs(user.userId, filtered);
  res.json({ success: true, message: '配置已删除' });
});

// 测试提供商连接
aiRouter.post('/test-connection', async (req: Request, res: Response) => {
  const { providerId, apiKey, apiBase } = req.body;

  try {
    const provider = getProviderById(providerId);
    const base = apiBase || provider?.apiBase || '';

    let testUrl: string;
    if (provider?.category === 'anthropic') {
      testUrl = `${base}/messages`;
    } else if (provider?.category === 'google') {
      testUrl = `${base}/models?key=${apiKey}`;
    } else {
      testUrl = `${base}/models`;
    }

    const headers: Record<string, string> = {};
    if (provider?.category === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else if (provider?.category !== 'google') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(testUrl, {
      method: provider?.category === 'anthropic' ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', ...headers },
      ...(provider?.category === 'anthropic' ? { body: JSON.stringify({ model: 'claude-3-haiku-20240307', max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] }) } : {}),
    });

    res.json({
      success: response.ok,
      data: {
        status: response.status,
        ok: response.ok,
        message: response.ok ? '连接成功' : `连接失败 (${response.status})`,
      },
    });
  } catch (error: any) {
    res.json({
      success: false,
      data: { ok: false, message: error.message || '连接失败' },
    });
  }
});

// ========== AI 生成（使用用户配置的提供商） ==========

aiRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { prompt, context, providerId, model } = req.body;

    if (!prompt) {
      res.status(400).json({ success: false, message: '请输入生成描述' });
      return;
    }

    // 获取用户配置
    const configs = getUserConfigs(user.userId);
    let activeConfig = providerId
      ? configs.find(c => c.providerId === providerId && c.enabled)
      : configs.find(c => c.isDefault && c.enabled)
      || configs.find(c => c.enabled);

    if (!activeConfig) {
      // 无配置时使用本地模板
      const components = generateFromTemplate(prompt);
      res.json({ success: true, data: { components, provider: 'local', fallback: true } });
      return;
    }

    const provider = getProviderById(activeConfig.providerId);
    if (!provider) {
      res.status(400).json({ success: false, message: '未找到提供商配置' });
      return;
    }

    const selectedModel = model || activeConfig.customModel || provider.models[0]?.id;
    if (!selectedModel) {
      res.status(400).json({ success: false, message: '未选择模型' });
      return;
    }

    const systemPrompt = `你是一个专业的移动端 UI 组件生成器。根据用户的描述，生成 React Native 风格的组件 JSON 配置。
每个组件格式：{ "id": "唯一ID", "type": "组件类型", "name": "名称", "props": {}, "style": {}, "children": [] }
可用类型：text, header, button, image, input, container, card, row, column, grid, list, avatar, badge, switch, divider
只返回 JSON 数组，不要其他文字。`;

    const userMessage = context
      ? `当前画布组件：${JSON.stringify(context)}\n\n需求：${prompt}`
      : `需求：${prompt}`;

    const result = await callAI({
      provider,
      config: activeConfig,
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      maxTokens: 4000,
    });

    // 提取 JSON
    const jsonMatch = result.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const components = JSON.parse(jsonMatch[0]);
      res.json({
        success: true,
        data: {
          components,
          provider: provider.name,
          model: result.model,
          usage: result.usage,
        },
      });
    } else {
      // 解析失败，回退到本地
      const components = generateFromTemplate(prompt);
      res.json({ success: true, data: { components, provider: 'local', fallback: true } });
    }
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    const components = generateFromTemplate(req.body.prompt || '');
    res.json({ success: true, data: { components, provider: 'local', fallback: true, error: error.message } });
  }
});

// 智能推荐
aiRouter.post('/recommend', (req: Request, res: Response) => {
  const { currentComponents } = req.body;
  const componentTypes = (currentComponents || []).map((c: any) => c.type);
  const recommendations: any[] = [];

  if (!componentTypes.includes('image')) recommendations.push({ type: 'image', reason: '添加图片让页面更生动' });
  if (!componentTypes.includes('button')) recommendations.push({ type: 'button', reason: '建议添加操作按钮引导用户' });
  if (componentTypes.length > 3 && !componentTypes.includes('divider')) recommendations.push({ type: 'divider', reason: '使用分割线组织内容' });
  if (!componentTypes.includes('card')) recommendations.push({ type: 'card', reason: '卡片组件更好地组织内容' });

  res.json({ success: true, data: recommendations.slice(0, 4) });
});

// ========== 本地模板生成 ==========

function generateFromTemplate(prompt: string): any[] {
  const lower = prompt.toLowerCase();
  const id = () => `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  if (lower.includes('登录') || lower.includes('login')) {
    return [
      { id: id(), type: 'container', name: '登录容器', props: {}, style: { padding: 32, backgroundColor: '#ffffff', minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }, children: [
        { id: id(), type: 'header', name: '欢迎', props: { text: '欢迎回来', level: 1 }, style: { color: '#1a1a2e', textAlign: 'center' } },
        { id: id(), type: 'text', name: '副标题', props: { content: '请登录您的账户' }, style: { color: '#6b7280', textAlign: 'center', fontSize: 14 } },
        { id: id(), type: 'input', name: '邮箱', props: { label: '邮箱', placeholder: '请输入邮箱' }, style: { width: '100%' } },
        { id: id(), type: 'input', name: '密码', props: { label: '密码', placeholder: '请输入密码' }, style: { width: '100%' } },
        { id: id(), type: 'button', name: '登录', props: { text: '登录' }, style: { width: '100%', padding: 14, backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: 10, fontSize: 16, fontWeight: 'bold' } },
        { id: id(), type: 'text', name: '注册', props: { content: '还没有账户？立即注册' }, style: { color: '#3b82f6', textAlign: 'center', fontSize: 13 } },
      ] },
    ];
  }

  if (lower.includes('个人') || lower.includes('profile')) {
    return [
      { id: id(), type: 'container', name: '个人主页', props: {}, style: { padding: 20, backgroundColor: '#f9fafb', minHeight: 500 }, children: [
        { id: id(), type: 'container', name: '头像区', props: {}, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 16 }, children: [
          { id: id(), type: 'avatar', name: '头像', props: { size: 80, src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user' }, style: {} },
          { id: id(), type: 'header', name: '用户名', props: { text: '张三', level: 2 }, style: {} },
          { id: id(), type: 'text', name: '简介', props: { content: '全栈开发者' }, style: { color: '#6b7280', fontSize: 13 } },
        ] },
        { id: id(), type: 'button', name: '编辑', props: { text: '编辑资料' }, style: { width: '100%', padding: 12, backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: 10 } },
      ] },
    ];
  }

  return [
    { id: id(), type: 'header', name: '标题', props: { text: '新页面', level: 1 }, style: { marginBottom: 16 }, children: [] },
    { id: id(), type: 'text', name: '描述', props: { content: '开始使用 AI App Builder！' }, style: { color: '#6b7280' }, children: [] },
  ];
}

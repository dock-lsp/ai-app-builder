import type { ComponentSchema } from '@/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'profile' | 'commerce' | 'content' | 'dashboard' | 'settings' | 'list' | 'form' | 'gallery' | 'onboarding';
  thumbnail: string;
  components: ComponentSchema[];
  tags: string[];
}

// 登录页面模板
export const loginTemplate: Template = {
  id: 'login',
  name: '登录页面',
  description: '简洁的登录表单，包含手机号和密码输入',
  category: 'auth',
  thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=登录页面',
  tags: ['登录', '表单', '认证'],
  components: [
    {
      id: 'header-1',
      type: 'header',
      name: '标题',
      props: { text: '欢迎登录', level: 1 },
      style: { textAlign: 'center', marginBottom: '32px', marginTop: '40px' },
      children: [],
    },
    {
      id: 'input-1',
      type: 'input',
      name: '输入框',
      props: { placeholder: '请输入手机号', label: '手机号' },
      style: { marginBottom: '16px' },
      children: [],
    },
    {
      id: 'input-2',
      type: 'input',
      name: '输入框',
      props: { placeholder: '请输入密码', label: '密码' },
      style: { marginBottom: '24px' },
      children: [],
    },
    {
      id: 'button-1',
      type: 'button',
      name: '按钮',
      props: { text: '登录' },
      style: { width: '100%', marginBottom: '12px', padding: '12px' },
      children: [],
    },
    {
      id: 'row-1',
      type: 'row',
      name: '行布局',
      props: {},
      style: { justifyContent: 'space-between', marginBottom: '24px' },
      children: [
        {
          id: 'text-1',
          type: 'text',
          name: '文本',
          props: { content: '忘记密码?' },
          style: { color: '#3b82f6', fontSize: '14px', cursor: 'pointer' },
          children: [],
        },
        {
          id: 'text-2',
          type: 'text',
          name: '文本',
          props: { content: '立即注册' },
          style: { color: '#3b82f6', fontSize: '14px', cursor: 'pointer' },
          children: [],
        },
      ],
    },
    {
      id: 'divider-1',
      type: 'divider',
      name: '分割线',
      props: {},
      style: { margin: '24px 0' },
      children: [],
    },
    {
      id: 'text-3',
      type: 'text',
      name: '文本',
      props: { content: '其他登录方式' },
      style: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '16px' },
      children: [],
    },
    {
      id: 'row-2',
      type: 'row',
      name: '行布局',
      props: {},
      style: { justifyContent: 'center', gap: '24px' },
      children: [
        {
          id: 'avatar-1',
          type: 'avatar',
          name: '头像',
          props: { src: 'https://via.placeholder.com/40/10b981/ffffff?text=W', size: 40 },
          style: { cursor: 'pointer' },
          children: [],
        },
        {
          id: 'avatar-2',
          type: 'avatar',
          name: '头像',
          props: { src: 'https://via.placeholder.com/40/ef4444/ffffff?text=Q', size: 40 },
          style: { cursor: 'pointer' },
          children: [],
        },
      ],
    },
  ],
};

// 个人主页模板
export const profileTemplate: Template = {
  id: 'profile',
  name: '个人主页',
  description: '展示个人信息、统计数据和操作按钮',
  category: 'profile',
  thumbnail: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=个人主页',
  tags: ['个人资料', '用户中心', '社交'],
  components: [
    {
      id: 'container-1',
      type: 'container',
      name: '容器',
      props: {},
      style: { textAlign: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '0', margin: '-24px', marginBottom: '24px' },
      children: [
        {
          id: 'avatar-1',
          type: 'avatar',
          name: '头像',
          props: { src: 'https://via.placeholder.com/100', size: 80 },
          style: { margin: '0 auto 16px', border: '4px solid white' },
          children: [],
        },
        {
          id: 'header-1',
          type: 'header',
          name: '标题',
          props: { text: '张三', level: 2 },
          style: { marginBottom: '4px', color: '#ffffff' },
          children: [],
        },
        {
          id: 'text-1',
          type: 'text',
          name: '文本',
          props: { content: '前端开发工程师 | 北京' },
          style: { color: 'rgba(255,255,255,0.8)', marginBottom: '16px' },
          children: [],
        },
        {
          id: 'badge-1',
          type: 'badge',
          name: '徽章',
          props: { text: 'VIP', color: '#f59e0b' },
          style: {},
          children: [],
        },
      ],
    },
    {
      id: 'row-1',
      type: 'row',
      name: '行布局',
      props: {},
      style: { justifyContent: 'center', gap: '48px', marginBottom: '24px', padding: '16px 0', borderBottom: '1px solid #e2e8f0' },
      children: [
        {
          id: 'col-1',
          type: 'column',
          name: '列布局',
          props: {},
          style: { textAlign: 'center' },
          children: [
            { id: 'text-2', type: 'text', name: '文本', props: { content: '128' }, style: { fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }, children: [] },
            { id: 'text-3', type: 'text', name: '文本', props: { content: '关注' }, style: { fontSize: '12px', color: '#64748b' }, children: [] },
          ],
        },
        {
          id: 'col-2',
          type: 'column',
          name: '列布局',
          props: {},
          style: { textAlign: 'center' },
          children: [
            { id: 'text-4', type: 'text', name: '文本', props: { content: '2.5k' }, style: { fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }, children: [] },
            { id: 'text-5', type: 'text', name: '文本', props: { content: '粉丝' }, style: { fontSize: '12px', color: '#64748b' }, children: [] },
          ],
        },
        {
          id: 'col-3',
          type: 'column',
          name: '列布局',
          props: {},
          style: { textAlign: 'center' },
          children: [
            { id: 'text-6', type: 'text', name: '文本', props: { content: '86' }, style: { fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }, children: [] },
            { id: 'text-7', type: 'text', name: '文本', props: { content: '作品' }, style: { fontSize: '12px', color: '#64748b' }, children: [] },
          ],
        },
      ],
    },
    {
      id: 'row-2',
      type: 'row',
      name: '行布局',
      props: {},
      style: { gap: '12px', marginBottom: '24px' },
      children: [
        {
          id: 'button-1',
          type: 'button',
          name: '按钮',
          props: { text: '关注' },
          style: { flex: 1 },
          children: [],
        },
        {
          id: 'button-2',
          type: 'button',
          name: '按钮',
          props: { text: '私信' },
          style: { flex: 1, backgroundColor: '#e2e8f0', color: '#1e293b' },
          children: [],
        },
      ],
    },
    {
      id: 'card-1',
      type: 'card',
      name: '卡片',
      props: { title: '个人简介' },
      style: {},
      children: [
        {
          id: 'text-8',
          type: 'text',
          name: '文本',
          props: { content: '热爱前端开发，专注于 React 和 React Native。喜欢分享技术文章，欢迎交流！' },
          style: { color: '#64748b', lineHeight: '1.6' },
          children: [],
        },
      ],
    },
  ],
};

// 商品详情页模板
export const productTemplate: Template = {
  id: 'product',
  name: '商品详情',
  description: '电商商品展示页面，包含图片、价格、描述和购买按钮',
  category: 'commerce',
  thumbnail: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=商品详情',
  tags: ['电商', '商品', '购买'],
  components: [
    {
      id: 'image-1',
      type: 'image',
      name: '图片',
      props: { src: 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=商品图片', alt: '商品图片' },
      style: { width: '100%', maxWidth: '100%', borderRadius: '12px', margin: '-24px', marginBottom: '20px' },
      children: [],
    },
    {
      id: 'badge-1',
      type: 'badge',
      name: '徽章',
      props: { text: '热销', color: '#ef4444' },
      style: { marginBottom: '12px' },
      children: [],
    },
    {
      id: 'header-1',
      type: 'header',
      name: '标题',
      props: { text: '高级无线蓝牙耳机 Pro', level: 2 },
      style: { marginBottom: '8px', fontSize: '20px' },
      children: [],
    },
    {
      id: 'text-1',
      type: 'text',
      name: '文本',
      props: { content: '¥299' },
      style: { fontSize: '28px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' },
      children: [],
    },
    {
      id: 'text-2',
      type: 'text',
      name: '文本',
      props: { content: '原价 ¥599' },
      style: { fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through', marginBottom: '12px' },
      children: [],
    },
    {
      id: 'row-1',
      type: 'row',
      name: '行布局',
      props: {},
      style: { gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
      children: [
        { id: 'badge-2', type: 'badge', name: '徽章', props: { text: '主动降噪', color: '#3b82f6' }, style: {}, children: [] },
        { id: 'badge-3', type: 'badge', name: '徽章', props: { text: '30小时续航', color: '#10b981' }, style: {}, children: [] },
        { id: 'badge-4', type: 'badge', name: '徽章', props: { text: '高清音质', color: '#8b5cf6' }, style: {}, children: [] },
      ],
    },
    {
      id: 'divider-1',
      type: 'divider',
      name: '分割线',
      props: {},
      style: { margin: '16px 0' },
      children: [],
    },
    {
      id: 'header-2',
      type: 'header',
      name: '标题',
      props: { text: '商品详情', level: 3 },
      style: { marginBottom: '12px', fontSize: '16px' },
      children: [],
    },
    {
      id: 'text-3',
      type: 'text',
      name: '文本',
      props: { content: '采用最新蓝牙 5.3 技术，支持主动降噪功能。人体工学设计，佩戴舒适。IPX7 级防水，运动无忧。' },
      style: { color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' },
      children: [],
    },
    {
      id: 'row-2',
      type: 'row',
      name: '行布局',
      props: {},
      style: { gap: '12px', position: 'sticky', bottom: '0', padding: '16px 0', background: '#fff' },
      children: [
        {
          id: 'button-1',
          type: 'button',
          name: '按钮',
          props: { text: '加入购物车' },
          style: { flex: 1, backgroundColor: '#f59e0b' },
          children: [],
        },
        {
          id: 'button-2',
          type: 'button',
          name: '按钮',
          props: { text: '立即购买' },
          style: { flex: 1 },
          children: [],
        },
      ],
    },
  ],
};

// 设置页面模板
export const settingsTemplate: Template = {
  id: 'settings',
  name: '设置页面',
  description: '应用设置界面，包含各种开关和选项',
  category: 'settings',
  thumbnail: 'https://via.placeholder.com/300x200/6b7280/ffffff?text=设置页面',
  tags: ['设置', '配置', '选项'],
  components: [
    {
      id: 'header-1',
      type: 'header',
      name: '标题',
      props: { text: '设置', level: 1 },
      style: { marginBottom: '24px' },
      children: [],
    },
    {
      id: 'card-1',
      type: 'card',
      name: '卡片',
      props: { title: '账号与安全' },
      style: { marginBottom: '16px' },
      children: [
        {
          id: 'row-1',
          type: 'row',
          name: '行布局',
          props: {},
          style: { justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
          children: [
            { id: 'text-1', type: 'text', name: '文本', props: { content: '修改密码' }, style: { fontSize: '14px' }, children: [] },
            { id: 'text-2', type: 'text', name: '文本', props: { content: '>' }, style: { color: '#9ca3af' }, children: [] },
          ],
        },
        {
          id: 'row-2',
          type: 'row',
          name: '行布局',
          props: {},
          style: { justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
          children: [
            { id: 'text-3', type: 'text', name: '文本', props: { content: '绑定手机' }, style: { fontSize: '14px' }, children: [] },
            { id: 'text-4', type: 'text', name: '文本', props: { content: '138****8888 >' }, style: { color: '#9ca3af', fontSize: '14px' }, children: [] },
          ],
        },
        {
          id: 'row-3',
          type: 'row',
          name: '行布局',
          props: {},
          style: { justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' },
          children: [
            { id: 'text-5', type: 'text', name: '文本', props: { content: '实名认证' }, style: { fontSize: '14px' }, children: [] },
            { id: 'badge-1', type: 'badge', name: '徽章', props: { text: '已认证', color: '#10b981' }, style: {}, children: [] },
          ],
        },
      ],
    },
    {
      id: 'card-2',
      type: 'card',
      name: '卡片',
      props: { title: '通知设置' },
      style: { marginBottom: '16px' },
      children: [
        {
          id: 'row-4',
          type: 'row',
          name: '行布局',
          props: {},
          style: { justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
          children: [
            { id: 'text-6', type: 'text', name: '文本', props: { content: '推送通知' }, style: { fontSize: '14px' }, children: [] },
            { id: 'switch-1', type: 'switch', name: '开关', props: { checked: true }, style: {}, children: [] },
          ],
        },
        {
          id: 'row-5',
          type: 'row',
          name: '行布局',
          props: {},
          style: { justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
          children: [
            { id: 'text-7', type: 'text', name: '文本', props: { content: '邮件通知' }, style: { fontSize: '14px' }, children: [] },
            { id: 'switch-2', type: 'switch', name: '开关', props: { checked: false }, style: {}, children: [] },
          ],
        },
        {
          id: 'row-6',
          type: 'row',
          name: '行布局',
          props: {},
          style: { justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' },
          children: [
            { id: 'text-8', type: 'text', name: '文本', props: { content: '短信通知' }, style: { fontSize: '14px' }, children: [] },
            { id: 'switch-3', type: 'switch', name: '开关', props: { checked: true }, style: {}, children: [] },
          ],
        },
      ],
    },
    {
      id: 'button-1',
      type: 'button',
      name: '按钮',
      props: { text: '退出登录' },
      style: { width: '100%', backgroundColor: '#ef4444', marginTop: '24px' },
      children: [],
    },
  ],
};

// 列表页面模板
export const listTemplate: Template = {
  id: 'list',
  name: '列表页面',
  description: '数据列表展示，支持搜索和筛选',
  category: 'list',
  thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=列表页面',
  tags: ['列表', '数据', '搜索'],
  components: [
    {
      id: 'input-1',
      type: 'input',
      name: '输入框',
      props: { placeholder: '搜索...', label: '' },
      style: { marginBottom: '16px' },
      children: [],
    },
    {
      id: 'row-1',
      type: 'row',
      name: '行布局',
      props: {},
      style: { gap: '8px', marginBottom: '16px', overflow: 'auto' },
      children: [
        { id: 'badge-1', type: 'badge', name: '徽章', props: { text: '全部', color: '#3b82f6' }, style: {}, children: [] },
        { id: 'badge-2', type: 'badge', name: '徽章', props: { text: '进行中', color: '#9ca3af' }, style: {}, children: [] },
        { id: 'badge-3', type: 'badge', name: '徽章', props: { text: '已完成', color: '#9ca3af' }, style: {}, children: [] },
        { id: 'badge-4', type: 'badge', name: '徽章', props: { text: '已取消', color: '#9ca3af' }, style: {}, children: [] },
      ],
    },
    {
      id: 'card-1',
      type: 'card',
      name: '卡片',
      props: { title: '' },
      style: { marginBottom: '12px' },
      children: [
        {
          id: 'row-2',
          type: 'row',
          name: '行布局',
          props: {},
          style: { gap: '12px' },
          children: [
            { id: 'avatar-1', type: 'avatar', name: '头像', props: { src: 'https://via.placeholder.com/50/3b82f6/ffffff?text=A', size: 50 }, style: {}, children: [] },
            {
              id: 'col-1',
              type: 'column',
              name: '列布局',
              props: {},
              style: { flex: 1 },
              children: [
                { id: 'text-1', type: 'text', name: '文本', props: { content: '订单 #2024001' }, style: { fontWeight: 'bold', marginBottom: '4px' }, children: [] },
                { id: 'text-2', type: 'text', name: '文本', props: { content: '2024-01-15 14:30' }, style: { fontSize: '12px', color: '#9ca3af' }, children: [] },
              ],
            },
            { id: 'badge-5', type: 'badge', name: '徽章', props: { text: '已完成', color: '#10b981' }, style: {}, children: [] },
          ],
        },
      ],
    },
    {
      id: 'card-2',
      type: 'card',
      name: '卡片',
      props: { title: '' },
      style: { marginBottom: '12px' },
      children: [
        {
          id: 'row-3',
          type: 'row',
          name: '行布局',
          props: {},
          style: { gap: '12px' },
          children: [
            { id: 'avatar-2', type: 'avatar', name: '头像', props: { src: 'https://via.placeholder.com/50/f59e0b/ffffff?text=B', size: 50 }, style: {}, children: [] },
            {
              id: 'col-2',
              type: 'column',
              name: '列布局',
              props: {},
              style: { flex: 1 },
              children: [
                { id: 'text-3', type: 'text', name: '文本', props: { content: '订单 #2024002' }, style: { fontWeight: 'bold', marginBottom: '4px' }, children: [] },
                { id: 'text-4', type: 'text', name: '文本', props: { content: '2024-01-15 10:20' }, style: { fontSize: '12px', color: '#9ca3af' }, children: [] },
              ],
            },
            { id: 'badge-6', type: 'badge', name: '徽章', props: { text: '进行中', color: '#f59e0b' }, style: {}, children: [] },
          ],
        },
      ],
    },
    {
      id: 'card-3',
      type: 'card',
      name: '卡片',
      props: { title: '' },
      style: { marginBottom: '12px' },
      children: [
        {
          id: 'row-4',
          type: 'row',
          name: '行布局',
          props: {},
          style: { gap: '12px' },
          children: [
            { id: 'avatar-3', type: 'avatar', name: '头像', props: { src: 'https://via.placeholder.com/50/ef4444/ffffff?text=C', size: 50 }, style: {}, children: [] },
            {
              id: 'col-3',
              type: 'column',
              name: '列布局',
              props: {},
              style: { flex: 1 },
              children: [
                { id: 'text-5', type: 'text', name: '文本', props: { content: '订单 #2024003' }, style: { fontWeight: 'bold', marginBottom: '4px' }, children: [] },
                { id: 'text-6', type: 'text', name: '文本', props: { content: '2024-01-14 16:45' }, style: { fontSize: '12px', color: '#9ca3af' }, children: [] },
              ],
            },
            { id: 'badge-7', type: 'badge', name: '徽章', props: { text: '待处理', color: '#6b7280' }, style: {}, children: [] },
          ],
        },
      ],
    },
  ],
};

// 表单页面模板
export const formTemplate: Template = {
  id: 'form',
  name: '表单页面',
  description: '数据录入表单，包含多种输入类型',
  category: 'form',
  thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=表单页面',
  tags: ['表单', '录入', '提交'],
  components: [
    {
      id: 'header-1',
      type: 'header',
      name: '标题',
      props: { text: '填写信息', level: 1 },
      style: { marginBottom: '24px' },
      children: [],
    },
    {
      id: 'input-1',
      type: 'input',
      name: '输入框',
      props: { placeholder: '请输入姓名', label: '姓名 *' },
      style: { marginBottom: '16px' },
      children: [],
    },
    {
      id: 'input-2',
      type: 'input',
      name: '输入框',
      props: { placeholder: '请输入手机号', label: '手机号 *' },
      style: { marginBottom: '16px' },
      children: [],
    },
    {
      id: 'input-3',
      type: 'input',
      name: '输入框',
      props: { placeholder: '请输入邮箱', label: '邮箱' },
      style: { marginBottom: '16px' },
      children: [],
    },
    {
      id: 'row-1',
      type: 'row',
      name: '行布局',
      props: {},
      style: { marginBottom: '16px' },
      children: [
        {
          id: 'col-1',
          type: 'column',
          name: '列布局',
          props: {},
          style: { flex: 1 },
          children: [
            { id: 'text-1', type: 'text', name: '文本', props: { content: '性别' }, style: { fontSize: '14px', marginBottom: '8px', color: '#374151' }, children: [] },
            {
              id: 'row-2',
              type: 'row',
              name: '行布局',
              props: {},
              style: { gap: '16px' },
              children: [
                { id: 'badge-1', type: 'badge', name: '徽章', props: { text: '男', color: '#3b82f6' }, style: {}, children: [] },
                { id: 'badge-2', type: 'badge', name: '徽章', props: { text: '女', color: '#9ca3af' }, style: {}, children: [] },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'row-3',
      type: 'row',
      name: '行布局',
      props: {},
      style: { justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
      children: [
        { id: 'text-2', type: 'text', name: '文本', props: { content: '接收通知' }, style: { fontSize: '14px' }, children: [] },
        { id: 'switch-1', type: 'switch', name: '开关', props: { checked: true }, style: {}, children: [] },
      ],
    },
    {
      id: 'button-1',
      type: 'button',
      name: '按钮',
      props: { text: '提交' },
      style: { width: '100%', padding: '14px' },
      children: [],
    },
  ],
};

// 仪表盘模板
export const dashboardTemplate: Template = {
  id: 'dashboard',
  name: '数据仪表盘',
  description: '数据可视化仪表盘，展示关键指标',
  category: 'dashboard',
  thumbnail: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=仪表盘',
  tags: ['数据', '图表', '统计'],
  components: [
    {
      id: 'header-1',
      type: 'header',
      name: '标题',
      props: { text: '数据概览', level: 1 },
      style: { marginBottom: '20px' },
      children: [],
    },
    {
      id: 'grid-1',
      type: 'grid',
      name: '网格',
      props: { columns: 2, gap: 12 },
      style: { marginBottom: '24px' },
      children: [
        {
          id: 'card-1',
          type: 'card',
          name: '卡片',
          props: { title: '' },
          style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' },
          children: [
            { id: 'text-1', type: 'text', name: '文本', props: { content: '总用户' }, style: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }, children: [] },
            { id: 'text-2', type: 'text', name: '文本', props: { content: '12,580' }, style: { fontSize: '28px', fontWeight: 'bold', color: 'white' }, children: [] },
            { id: 'badge-1', type: 'badge', name: '徽章', props: { text: '+12.5%', color: '#10b981' }, style: { marginTop: '8px' }, children: [] },
          ],
        },
        {
          id: 'card-2',
          type: 'card',
          name: '卡片',
          props: { title: '' },
          style: { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' },
          children: [
            { id: 'text-3', type: 'text', name: '文本', props: { content: '日活用户' }, style: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }, children: [] },
            { id: 'text-4', type: 'text', name: '文本', props: { content: '3,240' }, style: { fontSize: '28px', fontWeight: 'bold', color: 'white' }, children: [] },
            { id: 'badge-2', type: 'badge', name: '徽章', props: { text: '+8.2%', color: '#10b981' }, style: { marginTop: '8px' }, children: [] },
          ],
        },
        {
          id: 'card-3',
          type: 'card',
          name: '卡片',
          props: { title: '' },
          style: { background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' },
          children: [
            { id: 'text-5', type: 'text', name: '文本', props: { content: '总收入' }, style: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }, children: [] },
            { id: 'text-6', type: 'text', name: '文本', props: { content: '¥89,420' }, style: { fontSize: '28px', fontWeight: 'bold', color: 'white' }, children: [] },
            { id: 'badge-3', type: 'badge', name: '徽章', props: { text: '+23.1%', color: '#10b981' }, style: { marginTop: '8px' }, children: [] },
          ],
        },
        {
          id: 'card-4',
          type: 'card',
          name: '卡片',
          props: { title: '' },
          style: { background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' },
          children: [
            { id: 'text-7', type: 'text', name: '文本', props: { content: '订单数' }, style: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }, children: [] },
            { id: 'text-8', type: 'text', name: '文本', props: { content: '1,893' }, style: { fontSize: '28px', fontWeight: 'bold', color: 'white' }, children: [] },
            { id: 'badge-4', type: 'badge', name: '徽章', props: { text: '+5.4%', color: '#10b981' }, style: { marginTop: '8px' }, children: [] },
          ],
        },
      ],
    },
    {
      id: 'card-5',
      type: 'card',
      name: '卡片',
      props: { title: '最近活动' },
      style: {},
      children: [
        {
          id: 'list-1',
          type: 'list',
          name: '列表',
          props: { items: ['用户 A 购买了商品', '用户 B 注册了账号', '用户 C 发表了评论', '用户 D 完成了订单'] },
          style: {},
          children: [],
        },
      ],
    },
  ],
};

// 相册页面模板
export const galleryTemplate: Template = {
  id: 'gallery',
  name: '相册页面',
  description: '图片网格展示，支持分类浏览',
  category: 'gallery',
  thumbnail: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=相册页面',
  tags: ['相册', '图片', '网格'],
  components: [
    {
      id: 'header-1',
      type: 'header',
      name: '标题',
      props: { text: '我的相册', level: 1 },
      style: { marginBottom: '16px' },
      children: [],
    },
    {
      id: 'row-1',
      type: 'row',
      name: '行布局',
      props: {},
      style: { gap: '8px', marginBottom: '16px', overflow: 'auto' },
      children: [
        { id: 'badge-1', type: 'badge', name: '徽章', props: { text: '全部', color: '#ec4899' }, style: {}, children: [] },
        { id: 'badge-2', type: 'badge', name: '徽章', props: { text: '风景', color: '#9ca3af' }, style: {}, children: [] },
        { id: 'badge-3', type: 'badge', name: '徽章', props: { text: '人物', color: '#9ca3af' }, style: {}, children: [] },
        { id: 'badge-4', type: 'badge', name: '徽章', props: { text: '美食', color: '#9ca3af' }, style: {}, children: [] },
      ],
    },
    {
      id: 'grid-1',
      type: 'grid',
      name: '网格',
      props: { columns: 3, gap: 8 },
      style: {},
      children: [
        { id: 'image-1', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/e0e7ff/6366f1?text=1', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-2', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/fce7f3/ec4899?text=2', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-3', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/dcfce7/22c55e?text=3', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-4', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/fef3c7/f59e0b?text=4', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-5', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/fee2e2/ef4444?text=5', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-6', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/e0f2fe/0ea5e9?text=6', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-7', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/f3e8ff/a855f7?text=7', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-8', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/ecfccb/84cc16?text=8', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
        { id: 'image-9', type: 'image', name: '图片', props: { src: 'https://via.placeholder.com/150/ffe4e6/f43f5e?text=9', alt: '' }, style: { borderRadius: '8px', aspectRatio: '1', objectFit: 'cover', maxWidth: '100%' }, children: [] },
      ],
    },
  ],
};

// 引导页模板
export const onboardingTemplate: Template = {
  id: 'onboarding',
  name: '引导页面',
  description: '新用户引导页，展示应用核心功能',
  category: 'onboarding',
  thumbnail: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=引导页面',
  tags: ['引导', '介绍', '新手'],
  components: [
    {
      id: 'container-1',
      type: 'container',
      name: '容器',
      props: {},
      style: { textAlign: 'center', padding: '60px 24px', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
      children: [
        {
          id: 'image-1',
          type: 'image',
          name: '图片',
          props: { src: 'https://via.placeholder.com/200/8b5cf6/ffffff?text=Logo', alt: '' },
          style: { width: '120px', height: '120px', borderRadius: '24px', margin: '0 auto 32px', maxWidth: '120px' },
          children: [],
        },
        {
          id: 'header-1',
          type: 'header',
          name: '标题',
          props: { text: '欢迎使用', level: 1 },
          style: { marginBottom: '16px' },
          children: [],
        },
        {
          id: 'text-1',
          type: 'text',
          name: '文本',
          props: { content: '这是最好的移动应用构建平台，让你轻松创建专业级应用。' },
          style: { color: '#6b7280', marginBottom: '40px', lineHeight: '1.6' },
          children: [],
        },
        {
          id: 'grid-1',
          type: 'grid',
          name: '网格',
          props: { columns: 3, gap: 16 },
          style: { marginBottom: '40px' },
          children: [
            {
              id: 'col-1',
              type: 'column',
              name: '列布局',
              props: {},
              style: { textAlign: 'center' },
              children: [
                { id: 'avatar-1', type: 'avatar', name: '头像', props: { src: 'https://via.placeholder.com/50/3b82f6/ffffff?text=1', size: 50 }, style: { margin: '0 auto 8px' }, children: [] },
                { id: 'text-2', type: 'text', name: '文本', props: { content: '拖拽编辑' }, style: { fontSize: '12px', fontWeight: 'bold' }, children: [] },
              ],
            },
            {
              id: 'col-2',
              type: 'column',
              name: '列布局',
              props: {},
              style: { textAlign: 'center' },
              children: [
                { id: 'avatar-2', type: 'avatar', name: '头像', props: { src: 'https://via.placeholder.com/50/10b981/ffffff?text=2', size: 50 }, style: { margin: '0 auto 8px' }, children: [] },
                { id: 'text-3', type: 'text', name: '文本', props: { content: 'AI 生成' }, style: { fontSize: '12px', fontWeight: 'bold' }, children: [] },
              ],
            },
            {
              id: 'col-3',
              type: 'column',
              name: '列布局',
              props: {},
              style: { textAlign: 'center' },
              children: [
                { id: 'avatar-3', type: 'avatar', name: '头像', props: { src: 'https://via.placeholder.com/50/f59e0b/ffffff?text=3', size: 50 }, style: { margin: '0 auto 8px' }, children: [] },
                { id: 'text-4', type: 'text', name: '文本', props: { content: '一键发布' }, style: { fontSize: '12px', fontWeight: 'bold' }, children: [] },
              ],
            },
          ],
        },
        {
          id: 'button-1',
          type: 'button',
          name: '按钮',
          props: { text: '开始使用' },
          style: { width: '100%', padding: '16px', fontSize: '16px' },
          children: [],
        },
        {
          id: 'text-5',
          type: 'text',
          name: '文本',
          props: { content: '已有账号？立即登录' },
          style: { color: '#6b7280', marginTop: '16px', fontSize: '14px' },
          children: [],
        },
      ],
    },
  ],
};

// 所有模板
export const templates: Template[] = [
  loginTemplate,
  profileTemplate,
  productTemplate,
  settingsTemplate,
  listTemplate,
  formTemplate,
  dashboardTemplate,
  galleryTemplate,
  onboardingTemplate,
];

// 按分类获取模板
export const getTemplatesByCategory = (category: Template['category']) => {
  return templates.filter(t => t.category === category);
};

// 根据ID获取模板
export const getTemplateById = (id: string) => {
  return templates.find(t => t.id === id);
};

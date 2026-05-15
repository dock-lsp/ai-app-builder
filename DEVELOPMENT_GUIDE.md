# AI App Builder - 一周商业化开发指南

## 项目概述

已完成 **ai-app-builder** 可视化编辑器核心功能，现需在 **一周内** 完成商业化所需的全部功能。

---

## 当前进度

### 已完成 ✅
- [x] 可视化拖拽编辑器
- [x] 15 个基础组件（文本、按钮、图片、输入框、卡片、列表、布局等）
- [x] 属性面板（支持样式和属性编辑）
- [x] 组件树管理
- [x] AI 页面生成功能（模拟）
- [x] 撤销/重做系统
- [x] 项目导出功能

---

## 本周开发计划（Day 1-7）

### Day 1 - 核心功能完善
**目标：让编辑器达到可用状态**

- [ ] 修复嵌套组件拖拽问题
- [ ] 完善组件样式继承机制
- [ ] 添加组件复制/粘贴功能
- [ ] 实现画布缩放功能

**关键文件：**
- `src/components/Canvas.tsx` - 画布逻辑
- `src/components/RenderComponent.tsx` - 组件渲染
- `src/store/editorStore.ts` - 状态管理

---

### Day 2 - 模板系统
**目标：建立模板市场基础**

- [ ] 设计模板数据结构
- [ ] 创建 10 个精品模板：
  - 登录/注册页面
  - 个人主页
  - 商品详情页
  - 设置页面
  - 列表页面
  - 表单页面
  - 仪表盘
  - 博客文章页
  - 相册页面
  - 引导页
- [ ] 模板预览功能
- [ ] 模板导入/导出

**新增文件：**
- `src/templates/` - 模板目录
- `src/components/TemplateGallery.tsx` - 模板库组件

---

### Day 3 - 云端打包系统
**目标：实现 APK 生成功能**

- [ ] 设计打包 API 接口
- [ ] 创建打包任务队列
- [ ] 实现 React Native 代码生成器
- [ ] 对接云端编译服务（或本地 Docker）
- [ ] 打包状态实时推送

**新增文件：**
- `server/build-service.js` - 打包服务
- `src/utils/codeGenerator.ts` - 代码生成器
- `src/components/BuildPanel.tsx` - 打包面板

**打包流程：**
```
用户点击打包 → 生成 RN 代码 → 上传云端 → 编译 APK → 下载
```

---

### Day 4 - 用户系统 & 支付
**目标：完成商业化基础设施**

- [ ] 手机号登录/注册
- [ ] 微信登录集成
- [ ] 会员体系实现：
  - 免费版：每日 1 次打包
  - 创客版：¥19/月，无限打包
  - 专业版：¥99/年，源码导出
- [ ] 微信支付集成
- [ ] 订单管理

**新增文件：**
- `server/routes/auth.js` - 认证接口
- `server/routes/payment.js` - 支付接口
- `src/components/LoginModal.tsx` - 登录弹窗
- `src/components/PricingPanel.tsx` - 定价页面

---

### Day 5 - AI 功能增强
**目标：接入真实 AI 能力**

- [ ] 接入 DeepSeek/OpenAI API
- [ ] 实现智能组件推荐
- [ ] 添加 AI 样式优化
- [ ] 支持自然语言编辑
- [ ] AI 生成代码注释

**新增文件：**
- `server/routes/ai.js` - AI 服务接口
- `src/utils/aiPrompts.ts` - AI 提示词模板

**AI 功能列表：**
- 页面生成：输入描述生成完整页面
- 智能填充：根据上下文推荐内容
- 样式优化：一键美化界面
- 代码解释：解释生成代码的含义

---

### Day 6 - 优化 & 测试
**目标：提升用户体验**

- [ ] 性能优化（大数据量渲染）
- [ ] 添加操作引导（Onboarding）
- [ ] 错误处理完善
- [ ] 移动端适配优化
- [ ] 编写单元测试

**优化清单：**
- [ ] 虚拟滚动（组件树）
- [ ] 防抖保存
- [ ] 图片懒加载
- [ ] 打包进度动画

---

### Day 7 - 部署 & 上线准备
**目标：准备正式发布**

- [ ] 服务器部署（阿里云/腾讯云）
- [ ] 配置 CDN
- [ ] 数据库迁移
- [ ] 域名配置
- [ ] 准备营销材料：
  - 产品介绍文案
  - 使用教程视频脚本
  - 社交媒体宣传图

---

## 技术架构

### 前端
```
React 18 + TypeScript
├── 状态管理：Zustand
├── 拖拽：React DnD
├── 构建：Vite
└── 图标：Lucide React
```

### 后端
```
Node.js + Express
├── 数据库：MySQL 8.0
├── 缓存：Redis
├── 文件存储：阿里云 OSS
└── 支付：微信支付
```

### 打包服务
```
Docker + Android SDK
├── 代码生成：React Native
├── 编译：Gradle
└── 输出：APK 文件
```

---

## 文件结构

```
ai-app-builder-editor/
├── src/
│   ├── components/          # UI 组件
│   │   ├── Canvas.tsx       # 画布
│   │   ├── ComponentLibrary.tsx  # 组件库
│   │   ├── PropertyPanel.tsx     # 属性面板
│   │   ├── ComponentTree.tsx     # 组件树
│   │   ├── AIAssistant.tsx       # AI 助手
│   │   ├── Toolbar.tsx           # 工具栏
│   │   ├── TemplateGallery.tsx   # 模板库 [Day 2]
│   │   ├── BuildPanel.tsx        # 打包面板 [Day 3]
│   │   └── LoginModal.tsx        # 登录弹窗 [Day 4]
│   ├── store/
│   │   └── editorStore.ts   # 编辑器状态
│   ├── utils/
│   │   ├── codeGenerator.ts # 代码生成 [Day 3]
│   │   └── aiPrompts.ts     # AI 提示词 [Day 5]
│   ├── templates/           # 模板目录 [Day 2]
│   ├── types/
│   │   └── index.ts         # 类型定义
│   ├── App.tsx
│   └── main.tsx
├── server/                  # 后端服务 [Day 3-4]
│   ├── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── project.js
│   │   ├── build.js
│   │   ├── payment.js
│   │   └── ai.js
│   └── build-service/
│       └── Dockerfile
├── dist/                    # 构建输出
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 关键代码示例

### 1. 组件拖拽实现
```typescript
// 使用 React DnD 实现拖拽
const [{ isDragging }, drag] = useDrag(() => ({
  type: ItemTypes.COMPONENT,
  item: { type: componentType },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));

const [{ isOver }, drop] = useDrop(() => ({
  accept: ItemTypes.COMPONENT,
  drop: (item) => {
    addComponent(item.type, parentId);
  },
}));
```

### 2. 状态管理（Zustand）
```typescript
export const useEditorStore = create<EditorStore>((set, get) => ({
  components: [],
  selectedId: null,
  
  addComponent: (type, parentId) => {
    const newComponent = createComponent(type);
    set(state => ({
      components: addToTree(state.components, newComponent, parentId),
    }));
  },
  
  updateComponent: (id, updates) => {
    set(state => ({
      components: updateInTree(state.components, id, updates),
    }));
  },
}));
```

### 3. 代码生成器
```typescript
// 将组件树转换为 React Native 代码
export function generateRNCode(components: ComponentSchema[]): string {
  return components.map(comp => {
    switch (comp.type) {
      case 'button':
        return `<Button title="${comp.props.text}" />`;
      case 'text':
        return `<Text>${comp.props.content}</Text>`;
      // ...
    }
  }).join('\n');
}
```

---

## 商业化配置

### 定价策略
| 版本 | 价格 | 功能 |
|------|------|------|
| 免费版 | ¥0 | 每日 1 次打包，基础组件 |
| 创客版 | ¥19/月 | 无限打包，全部组件 |
| 专业版 | ¥99/年 | 源码导出，优先编译 |

### 成本估算
| 项目 | 月费用 |
|------|--------|
| 云服务器（4核8G） | ¥200 |
| 数据库（MySQL） | ¥100 |
| 对象存储（OSS） | ¥50（按量） |
| 编译服务器 | ¥400 |
| **总计** | **¥750/月** |

---

## 启动命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 启动后端服务（Day 3 后）
cd server && npm start
```

---

## 后续规划

### Week 2
- [ ] iOS 打包支持
- [ ] 团队协作功能
- [ ] 插件市场

### Week 3
- [ ] 数据分析看板
- [ ] A/B 测试功能
- [ ] 自动化测试

### Month 2
- [ ] 企业版定制
- [ ] API 开放平台
- [ ] 国际化支持

---

## 联系方式

项目地址：https://github.com/qq00150610-cpu/ai-app-builder

**祝开发顺利！**

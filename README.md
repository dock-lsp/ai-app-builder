# AI App Builder - 可视化编辑器

一款面向移动端的 AI 驱动低代码应用开发平台。

## 功能特性

### 核心功能
- **可视化拖拽编辑** - 直观的组件拖拽系统，支持嵌套布局
- **15+ 基础组件** - 文本、按钮、图片、输入框、卡片、列表等
- **实时属性编辑** - 选中组件即可编辑属性和样式
- **组件树管理** - 层级化的组件结构展示
- **撤销/重做** - 完整的操作历史记录

### AI 功能
- **AI 页面生成** - 输入描述自动生成页面结构
- **智能推荐** - 基于上下文的组件推荐

### 布局系统
- 容器、行/列布局、网格布局
- Flexbox 支持
- 响应式适配

## 技术栈

- React 18 + TypeScript
- Vite 构建工具
- Zustand 状态管理
- React DnD 拖拽系统
- Lucide React 图标库

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── ComponentLibrary.tsx   # 组件库面板
│   ├── Canvas.tsx              # 画布区域
│   ├── RenderComponent.tsx     # 组件渲染器
│   ├── PropertyPanel.tsx       # 属性面板
│   ├── ComponentTree.tsx       # 组件树
│   ├── AIAssistant.tsx         # AI 助手
│   └── Toolbar.tsx             # 工具栏
├── store/
│   └── editorStore.ts    # 编辑器状态管理
├── types/
│   └── index.ts          # TypeScript 类型定义
├── App.tsx               # 主应用组件
├── main.tsx              # 入口文件
└── index.css             # 全局样式
```

## 开发计划

### 已完成 ✅
- [x] 可视化拖拽编辑器核心
- [x] 15 个基础组件
- [x] 属性面板
- [x] 组件树
- [x] AI 页面生成
- [x] 撤销/重做系统

### 待开发 📋
- [ ] 模板市场
- [ ] 云端打包
- [ ] iOS 支持
- [ ] 团队协作

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

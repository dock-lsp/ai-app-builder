import { useDrag } from 'react-dnd';
import { 
  Layout, Type, Image, Square, MousePointer, 
  List, CreditCard, Heading, Columns,
  User, BadgeCheck, ToggleLeft, Minus, type LucideIcon
} from 'lucide-react';
import type { ComponentDefinition } from '@/types';
import { ItemTypes } from '@/types';

const componentDefinitions: ComponentDefinition[] = [
  // 基础组件
  {
    type: 'text',
    name: '文本',
    icon: 'Type',
    category: 'basic',
    defaultProps: { content: '这是一段文本' },
    defaultStyle: { fontSize: '16px', color: '#1e293b' },
    propDefinitions: [
      { name: 'content', label: '内容', type: 'textarea', defaultValue: '这是一段文本' },
    ],
  },
  {
    type: 'header',
    name: '标题',
    icon: 'Heading',
    category: 'basic',
    defaultProps: { text: '标题', level: 1 },
    defaultStyle: { fontSize: '24px', fontWeight: 'bold' },
    propDefinitions: [
      { name: 'text', label: '文本', type: 'string', defaultValue: '标题' },
      { name: 'level', label: '级别', type: 'select', options: ['1', '2', '3', '4'], defaultValue: 1 },
    ],
  },
  {
    type: 'button',
    name: '按钮',
    icon: 'MousePointer',
    category: 'basic',
    defaultProps: { text: '点击我' },
    defaultStyle: { 
      padding: '10px 20px', 
      backgroundColor: '#3b82f6', 
      color: '#ffffff',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer'
    },
    propDefinitions: [
      { name: 'text', label: '文本', type: 'string', defaultValue: '点击我' },
    ],
  },
  {
    type: 'image',
    name: '图片',
    icon: 'Image',
    category: 'basic',
    defaultProps: { src: 'https://via.placeholder.com/300x200', alt: '图片' },
    defaultStyle: { width: '100%', maxWidth: '300px', borderRadius: '8px' },
    propDefinitions: [
      { name: 'src', label: '图片地址', type: 'string', defaultValue: 'https://via.placeholder.com/300x200' },
      { name: 'alt', label: '替代文本', type: 'string', defaultValue: '图片' },
    ],
  },
  {
    type: 'divider',
    name: '分割线',
    icon: 'Minus',
    category: 'basic',
    defaultProps: {},
    defaultStyle: { height: '1px', backgroundColor: '#e2e8f0', margin: '16px 0' },
    propDefinitions: [],
  },
  
  // 布局组件
  {
    type: 'container',
    name: '容器',
    icon: 'Layout',
    category: 'layout',
    defaultProps: {},
    defaultStyle: { 
      minHeight: '100px', 
      padding: '16px', 
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px'
    },
    propDefinitions: [],
  },
  {
    type: 'card',
    name: '卡片',
    icon: 'CreditCard',
    category: 'layout',
    defaultProps: { title: '卡片标题' },
    defaultStyle: { 
      padding: '20px', 
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    propDefinitions: [
      { name: 'title', label: '标题', type: 'string', defaultValue: '卡片标题' },
    ],
  },
  {
    type: 'row',
    name: '行布局',
    icon: 'Layout',
    category: 'layout',
    defaultProps: {},
    defaultStyle: { display: 'flex', flexDirection: 'row', gap: '16px', width: '100%' },
    propDefinitions: [],
  },
  {
    type: 'column',
    name: '列布局',
    icon: 'Columns',
    category: 'layout',
    defaultProps: { span: 12 },
    defaultStyle: { flex: 1, minWidth: '0' },
    propDefinitions: [
      { name: 'span', label: '占比', type: 'select', options: ['1', '2', '3', '4', '6', '12'], defaultValue: 12 },
    ],
  },
  {
    type: 'grid',
    name: '网格',
    icon: 'Layout',
    category: 'layout',
    defaultProps: { columns: 2, gap: 16 },
    defaultStyle: { display: 'grid', gap: '16px' },
    propDefinitions: [
      { name: 'columns', label: '列数', type: 'select', options: ['1', '2', '3', '4'], defaultValue: 2 },
      { name: 'gap', label: '间距', type: 'number', defaultValue: 16 },
    ],
  },
  
  // 表单组件
  {
    type: 'input',
    name: '输入框',
    icon: 'Square',
    category: 'form',
    defaultProps: { placeholder: '请输入内容', label: '' },
    defaultStyle: { 
      width: '100%', 
      padding: '10px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px'
    },
    propDefinitions: [
      { name: 'placeholder', label: '占位符', type: 'string', defaultValue: '请输入内容' },
      { name: 'label', label: '标签', type: 'string', defaultValue: '' },
    ],
  },
  {
    type: 'switch',
    name: '开关',
    icon: 'ToggleLeft',
    category: 'form',
    defaultProps: { checked: false },
    defaultStyle: {},
    propDefinitions: [
      { name: 'checked', label: '开启', type: 'boolean', defaultValue: false },
    ],
  },
  
  // 数据展示
  {
    type: 'list',
    name: '列表',
    icon: 'List',
    category: 'data',
    defaultProps: { items: ['项目1', '项目2', '项目3'] },
    defaultStyle: { padding: '0', listStyle: 'none' },
    propDefinitions: [
      { name: 'items', label: '项目', type: 'json', defaultValue: ['项目1', '项目2', '项目3'] },
    ],
  },
  {
    type: 'avatar',
    name: '头像',
    icon: 'User',
    category: 'data',
    defaultProps: { src: 'https://via.placeholder.com/40', size: 40 },
    defaultStyle: { borderRadius: '50%', objectFit: 'cover' },
    propDefinitions: [
      { name: 'src', label: '图片地址', type: 'string', defaultValue: 'https://via.placeholder.com/40' },
      { name: 'size', label: '尺寸', type: 'number', defaultValue: 40 },
    ],
  },
  {
    type: 'badge',
    name: '徽章',
    icon: 'BadgeCheck',
    category: 'data',
    defaultProps: { text: 'New', color: '#ef4444' },
    defaultStyle: { 
      display: 'inline-flex',
      padding: '2px 8px',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderRadius: '12px',
      fontSize: '12px'
    },
    propDefinitions: [
      { name: 'text', label: '文本', type: 'string', defaultValue: 'New' },
      { name: 'color', label: '颜色', type: 'color', defaultValue: '#ef4444' },
    ],
  },
];

const iconMap: Record<string, LucideIcon> = {
  Layout, Type, Image, Square, MousePointer, 
  List, CreditCard, Heading, Columns,
  User, BadgeCheck, ToggleLeft, Minus
};

interface DraggableComponentItemProps {
  definition: ComponentDefinition;
}

function DraggableComponentItem({ definition }: DraggableComponentItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type: definition.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = iconMap[definition.icon] || Square;

  return (
    <div
      ref={drag}
      className="component-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Icon size={18} />
      <span>{definition.name}</span>
    </div>
  );
}

export function ComponentLibrary() {
  const categories = [
    { key: 'basic', label: '基础组件' },
    { key: 'layout', label: '布局组件' },
    { key: 'form', label: '表单组件' },
    { key: 'data', label: '数据展示' },
  ] as const;

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span>组件库</span>
      </div>
      <div className="panel-content" style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {categories.map(category => {
          const components = componentDefinitions.filter(c => c.category === category.key);
          if (components.length === 0) return null;
          
          return (
            <div key={category.key} style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                color: 'var(--text-secondary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {category.label}
              </div>
              {components.map(def => (
                <DraggableComponentItem key={def.type} definition={def} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { componentDefinitions };

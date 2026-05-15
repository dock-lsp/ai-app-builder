// 组件类型定义
export interface ComponentSchema {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  style: React.CSSProperties;
  children: ComponentSchema[];
  parentId?: string;
}

// 编辑器状态
export interface EditorState {
  components: ComponentSchema[];
  selectedId: string | null;
  hoveredId: string | null;
  history: ComponentSchema[][];
  historyIndex: number;
}

// 组件定义
export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  category: 'basic' | 'layout' | 'form' | 'data' | 'media';
  defaultProps: Record<string, any>;
  defaultStyle: React.CSSProperties;
  propDefinitions: PropDefinition[];
}

// 属性定义
export interface PropDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'json';
  options?: string[];
  defaultValue?: any;
}

// 拖拽类型
export const ItemTypes = {
  COMPONENT: 'component',
  TREE_NODE: 'tree_node',
} as const;

// AI 生成请求
export interface AIGenerateRequest {
  prompt: string;
  currentPage?: ComponentSchema;
}

// AI 生成响应
export interface AIGenerateResponse {
  components: ComponentSchema[];
  explanation?: string;
}

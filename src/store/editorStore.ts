import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ComponentSchema, EditorState } from '@/types';

interface EditorStore extends EditorState {
  // 组件操作
  addComponent: (type: string, parentId?: string) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentSchema>) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  moveComponent: (id: string, targetParentId: string, index?: number) => void;
  duplicateComponent: (id: string) => void;
  copyComponent: (id: string) => void;
  pasteComponent: (parentId?: string) => void;
  
  // 选择操作
  selectComponent: (id: string | null) => void;
  hoverComponent: (id: string | null) => void;
  
  // 历史记录
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  
  // 项目操作
  loadProject: (components: ComponentSchema[]) => void;
  exportProject: () => ComponentSchema[];
  clearCanvas: () => void;
  
  // 画布缩放
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  
  // 剪贴板
  clipboard: ComponentSchema | null;
}

// 默认组件配置
const defaultComponentConfigs: Record<string, Partial<ComponentSchema>> = {
  container: {
    name: '容器',
    props: {},
    style: {
      minHeight: '100px',
      padding: '16px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
    },
  },
  text: {
    name: '文本',
    props: { content: '这是一段文本' },
    style: {
      fontSize: '16px',
      color: '#1e293b',
      lineHeight: '1.5',
    },
  },
  button: {
    name: '按钮',
    props: { text: '点击我', onClick: '' },
    style: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
    },
  },
  image: {
    name: '图片',
    props: { src: 'https://via.placeholder.com/300x200', alt: '图片' },
    style: {
      width: '100%',
      maxWidth: '300px',
      borderRadius: '8px',
    },
  },
  input: {
    name: '输入框',
    props: { placeholder: '请输入内容', label: '' },
    style: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px',
    },
  },
  card: {
    name: '卡片',
    props: { title: '卡片标题' },
    style: {
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
  },
  list: {
    name: '列表',
    props: { items: ['项目1', '项目2', '项目3'] },
    style: {
      padding: '0',
      listStyle: 'none',
    },
  },
  divider: {
    name: '分割线',
    props: {},
    style: {
      height: '1px',
      backgroundColor: '#e2e8f0',
      margin: '16px 0',
    },
  },
  header: {
    name: '标题',
    props: { text: '标题', level: 1 },
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: '0 0 16px 0',
    },
  },
  row: {
    name: '行布局',
    props: {},
    style: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      width: '100%',
    },
  },
  column: {
    name: '列布局',
    props: { span: 12 },
    style: {
      flex: 1,
      minWidth: '0',
    },
  },
  grid: {
    name: '网格',
    props: { columns: 2, gap: 16 },
    style: {
      display: 'grid',
      gap: '16px',
    },
  },
  avatar: {
    name: '头像',
    props: { src: 'https://via.placeholder.com/40', size: 40 },
    style: {
      borderRadius: '50%',
      objectFit: 'cover',
    },
  },
  badge: {
    name: '徽章',
    props: { text: 'New', color: '#ef4444' },
    style: {
      display: 'inline-flex',
      padding: '2px 8px',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderRadius: '12px',
      fontSize: '12px',
    },
  },
  switch: {
    name: '开关',
    props: { checked: false },
    style: {},
  },
};

const findComponentById = (components: ComponentSchema[], id: string): ComponentSchema | null => {
  for (const comp of components) {
    if (comp.id === id) return comp;
    if (comp.children.length > 0) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findParentById = (components: ComponentSchema[], id: string, parent: ComponentSchema | null = null): ComponentSchema | null => {
  for (const comp of components) {
    if (comp.id === id) return parent;
    if (comp.children.length > 0) {
      const found = findParentById(comp.children, id, comp);
      if (found) return found;
    }
  }
  return null;
};

const removeComponentFromTree = (components: ComponentSchema[], id: string): ComponentSchema[] => {
  return components.filter(comp => {
    if (comp.id === id) return false;
    comp.children = removeComponentFromTree(comp.children, id);
    return true;
  });
};

const updateComponentInTree = (
  components: ComponentSchema[],
  id: string,
  updates: Partial<ComponentSchema>
): ComponentSchema[] => {
  return components.map(comp => {
    if (comp.id === id) {
      return { ...comp, ...updates };
    }
    if (comp.children.length > 0) {
      return {
        ...comp,
        children: updateComponentInTree(comp.children, id, updates),
      };
    }
    return comp;
  });
};

const addComponentToTree = (
  components: ComponentSchema[],
  newComponent: ComponentSchema,
  parentId?: string
): ComponentSchema[] => {
  if (!parentId) {
    return [...components, newComponent];
  }

  return components.map(comp => {
    if (comp.id === parentId) {
      return {
        ...comp,
        children: [...comp.children, newComponent],
      };
    }
    if (comp.children.length > 0) {
      return {
        ...comp,
        children: addComponentToTree(comp.children, newComponent, parentId),
      };
    }
    return comp;
  });
};

// 深拷贝组件及其子组件
const cloneComponent = (component: ComponentSchema, newParentId?: string): ComponentSchema => {
  const newId = uuidv4();
  return {
    ...component,
    id: newId,
    parentId: newParentId,
    children: component.children.map(child => cloneComponent(child, newId)),
  };
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  components: [],
  selectedId: null,
  hoveredId: null,
  history: [[]],
  historyIndex: 0,
  zoom: 1,
  clipboard: null,

  addComponent: (type, parentId) => {
    const config = defaultComponentConfigs[type] || {
      name: '未知组件',
      props: {},
      style: {},
    };

    const newComponent: ComponentSchema = {
      id: uuidv4(),
      type,
      name: config.name!,
      props: { ...config.props },
      style: { ...config.style },
      children: [],
      parentId,
    };

    set(state => {
      const newComponents = addComponentToTree(state.components, newComponent, parentId);
      return {
        components: newComponents,
        selectedId: newComponent.id,
        history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  removeComponent: (id) => {
    set(state => {
      const newComponents = removeComponentFromTree(state.components, id);
      return {
        components: newComponents,
        selectedId: state.selectedId === id ? null : state.selectedId,
        history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  updateComponent: (id, updates) => {
    set(state => {
      const newComponents = updateComponentInTree(state.components, id, updates);
      return {
        components: newComponents,
        history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  updateComponentProps: (id, props) => {
    const { updateComponent } = get();
    updateComponent(id, { props });
  },

  updateComponentStyle: (id, style) => {
    const { updateComponent } = get();
    updateComponent(id, { style });
  },

  moveComponent: (id, targetParentId, index) => {
    set(state => {
      const componentToMove = findComponentById(state.components, id);
      if (!componentToMove) return state;

      let newComponents = removeComponentFromTree(state.components, id);
      
      const movedComponent = { ...componentToMove, parentId: targetParentId };
      
      if (!targetParentId) {
        if (index !== undefined) {
          newComponents.splice(index, 0, movedComponent);
        } else {
          newComponents.push(movedComponent);
        }
      } else {
        newComponents = addComponentToTree(newComponents, movedComponent, targetParentId);
      }

      return {
        components: newComponents,
        history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  duplicateComponent: (id) => {
    const { components } = get();
    const componentToDuplicate = findComponentById(components, id);
    if (!componentToDuplicate) return;

    const parent = findParentById(components, id);
    const newComponent = cloneComponent(componentToDuplicate, parent?.id);
    newComponent.name = `${newComponent.name} (复制)`;

    set(state => {
      const newComponents = parent 
        ? addComponentToTree(state.components, newComponent, parent.id)
        : [...state.components, newComponent];
      
      return {
        components: newComponents,
        selectedId: newComponent.id,
        history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  copyComponent: (id) => {
    const { components } = get();
    const componentToCopy = findComponentById(components, id);
    if (componentToCopy) {
      set({ clipboard: componentToCopy });
    }
  },

  pasteComponent: (parentId) => {
    const { clipboard } = get();
    if (!clipboard) return;

    const newComponent = cloneComponent(clipboard, parentId);
    
    set(state => {
      const newComponents = addComponentToTree(state.components, newComponent, parentId);
      return {
        components: newComponents,
        selectedId: newComponent.id,
        history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  selectComponent: (id) => set({ selectedId: id }),
  hoverComponent: (id) => set({ hoveredId: id }),

  undo: () => {
    set(state => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        components: state.history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      };
    });
  },

  redo: () => {
    set(state => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        components: state.history[newIndex],
        historyIndex: newIndex,
        selectedId: null,
      };
    });
  },

  saveHistory: () => {
    set(state => ({
      history: [...state.history.slice(0, state.historyIndex + 1), state.components],
      historyIndex: state.historyIndex + 1,
    }));
  },

  loadProject: (components) => {
    set({
      components,
      selectedId: null,
      history: [components],
      historyIndex: 0,
    });
  },

  exportProject: () => get().components,

  clearCanvas: () => {
    set(state => ({
      components: [],
      selectedId: null,
      history: [...state.history.slice(0, state.historyIndex + 1), []],
      historyIndex: state.historyIndex + 1,
    }));
  },

  // 画布缩放
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
  zoomIn: () => set(state => ({ zoom: Math.min(2, state.zoom + 0.1) })),
  zoomOut: () => set(state => ({ zoom: Math.max(0.5, state.zoom - 0.1) })),
  resetZoom: () => set({ zoom: 1 }),
}));

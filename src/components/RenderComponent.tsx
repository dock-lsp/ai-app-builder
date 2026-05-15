import { useDrag, useDrop } from 'react-dnd';
import { useEditorStore } from '@/store/editorStore';
import { ItemTypes, type ComponentSchema } from '@/types';
import { useRef } from 'react';

interface RenderComponentProps {
  component: ComponentSchema;
  isSelected: boolean;
  isPreview?: boolean;
  parentId?: string;
  index?: number;
}

export function RenderComponent({ component, isSelected, isPreview = false, parentId, index }: RenderComponentProps) {
  const { selectComponent, hoverComponent, hoveredId, removeComponent, addComponent, moveComponent } = useEditorStore();
  const isHovered = hoveredId === component.id;
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TREE_NODE,
    item: { id: component.id, type: component.type, parentId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.COMPONENT, ItemTypes.TREE_NODE],
    canDrop: (item: { type?: string; id?: string }) => {
      // 防止拖拽到自身或子元素
      if (item.id === component.id) return false;
      return true;
    },
    drop: (item: { type?: string; id?: string; parentId?: string; index?: number }, monitor) => {
      if (!monitor.didDrop()) {
        if (item.type && !item.id) {
          // 从组件库拖拽 - 添加到容器
          addComponent(item.type, component.id);
        } else if (item.id) {
          // 移动现有组件
          moveComponent(item.id, component.id);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }));

  // 用于在组件之间插入的 drop
  const [{ isOverInsert }] = useDrop(() => ({
    accept: [ItemTypes.TREE_NODE],
    drop: (item: { id?: string; parentId?: string; index?: number }, monitor) => {
      if (!monitor.didDrop() && item.id && parentId) {
        // 在同一父容器内重新排序
        moveComponent(item.id, parentId, index);
      }
    },
    collect: (monitor) => ({
      isOverInsert: monitor.isOver(),
    }),
  }));

  drag(drop(ref));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const handleMouseEnter = () => {
    if (!isPreview) hoverComponent(component.id);
  };

  const handleMouseLeave = () => {
    if (!isPreview) hoverComponent(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { id, ...componentWithoutId } = component;
    const duplicatedComponent = {
      ...componentWithoutId,
      id: `${Date.now()}`,
      name: `${component.name} (复制)`,
      children: component.children.map(child => ({
        ...child,
        id: `${Date.now()}_${child.id}`,
      })),
    };
    // 添加到同一父容器
    if (parentId) {
      addComponent(duplicatedComponent.type, parentId);
    } else {
      addComponent(duplicatedComponent.type);
    }
  };

  // 渲染组件内容
  const renderContent = () => {
    const { type, props, children } = component;

    switch (type) {
      case 'text':
        return <span>{props.content}</span>;
      
      case 'header':
        const HeaderTag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
        return <HeaderTag>{props.text}</HeaderTag>;
      
      case 'button':
        return <button>{props.text}</button>;
      
      case 'image':
        return <img src={props.src} alt={props.alt} style={{ pointerEvents: 'none' }} />;
      
      case 'input':
        return (
          <div>
            {props.label && <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>{props.label}</label>}
            <input type="text" placeholder={props.placeholder} readOnly style={{ pointerEvents: 'none' }} />
          </div>
        );
      
      case 'card':
        return (
          <div>
            {props.title && <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>{props.title}</div>}
            {children.length > 0 && (
              <div>
                {children.map((child, idx) => (
                  <RenderComponent 
                    key={child.id} 
                    component={child} 
                    isSelected={false} 
                    isPreview={isPreview}
                    parentId={component.id}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'container':
      case 'row':
      case 'column':
        return (
          <div>
            {children.map((child, idx) => (
              <RenderComponent 
                key={child.id} 
                component={child} 
                isSelected={false} 
                isPreview={isPreview}
                parentId={component.id}
                index={idx}
              />
            ))}
          </div>
        );
      
      case 'grid':
        const gridStyle: React.CSSProperties = {
          display: 'grid',
          gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`,
          gap: `${props.gap || 16}px`,
        };
        return (
          <div style={gridStyle}>
            {children.map((child, idx) => (
              <RenderComponent 
                key={child.id} 
                component={child} 
                isSelected={false} 
                isPreview={isPreview}
                parentId={component.id}
                index={idx}
              />
            ))}
          </div>
        );
      
      case 'list':
        const items = Array.isArray(props.items) ? props.items : ['项目1', '项目2', '项目3'];
        return (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {items.map((item: string, idx: number) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
            ))}
          </ul>
        );
      
      case 'avatar':
        return (
          <img 
            src={props.src} 
            alt="avatar" 
            style={{ 
              width: `${props.size || 40}px`, 
              height: `${props.size || 40}px`,
              borderRadius: '50%',
              objectFit: 'cover'
            }} 
          />
        );
      
      case 'badge':
        return (
          <span style={{ 
            display: 'inline-flex',
            padding: '2px 8px',
            backgroundColor: props.color || '#ef4444',
            color: '#ffffff',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {props.text}
          </span>
        );
      
      case 'switch':
        return (
          <div style={{ 
            width: '44px', 
            height: '24px', 
            backgroundColor: props.checked ? '#3b82f6' : '#e2e8f0',
            borderRadius: '12px',
            position: 'relative',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: props.checked ? '22px' : '2px',
              transition: 'left 0.2s'
            }} />
          </div>
        );
      
      case 'divider':
        return <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '16px 0' }} />;
      
      default:
        return <div>未知组件: {type}</div>;
    }
  };

  const containerStyle: React.CSSProperties = {
    ...component.style,
    position: 'relative',
    cursor: isPreview ? 'default' : 'pointer',
    opacity: isDragging ? 0.5 : 1,
  };

  // 预览模式直接渲染
  if (isPreview) {
    return (
      <div style={containerStyle}>
        {renderContent()}
      </div>
    );
  }

  return (
    <>
      {/* 插入位置指示器 */}
      {isOverInsert && (
        <div
          style={{
            height: '3px',
            backgroundColor: '#22c55e',
            borderRadius: '2px',
            margin: '2px 0',
          }}
        />
      )}
      <div
        ref={ref}
        style={containerStyle}
        className={`${isSelected ? 'component-selected' : ''} ${isHovered ? 'component-hover' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
        
        {/* 选中时的操作按钮 */}
        {(isSelected || isHovered) && (
          <div
            style={{
              position: 'absolute',
              top: '-28px',
              right: '0',
              display: 'flex',
              gap: '4px',
              zIndex: 100,
            }}
          >
            <span
              style={{
                padding: '4px 8px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                fontSize: '11px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              {component.name}
            </span>
            {isSelected && (
              <>
                <button
                  onClick={handleDuplicate}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontSize: '11px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  复制
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '11px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  删除
                </button>
              </>
            )}
          </div>
        )}
        
        {/* 拖拽放置指示器 - 容器可放置 */}
        {isOver && canDrop && ['container', 'card', 'row', 'column', 'grid'].includes(component.type) && (
          <div
            style={{
              position: 'absolute',
              inset: '0',
              border: '2px dashed #3b82f6',
              borderRadius: '4px',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </>
  );
}

import { useDrop } from 'react-dnd';
import { useEditorStore } from '@/store/editorStore';
import { ItemTypes } from '@/types';
import { RenderComponent } from './RenderComponent';

export function Canvas() {
  const { components, addComponent, selectedId, selectComponent, zoom } = useEditorStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: { type: string }) => {
      addComponent(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  return (
    <div
      ref={drop}
      className="canvas-grid"
      onClick={handleCanvasClick}
      style={{
        flex: 1,
        height: '100%',
        overflow: 'auto',
        padding: '40px',
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : 'var(--background)',
        transition: 'background-color 0.2s',
      }}
    >
      <div
        style={{
          minHeight: '800px',
          maxWidth: '414px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '24px',
          position: 'relative',
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {components.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: 'var(--text-secondary)',
              border: '2px dashed var(--border)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>+</div>
            <div style={{ fontSize: '14px' }}>从左侧拖拽组件到此处</div>
            <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
              或使用 AI 生成页面
            </div>
          </div>
        ) : (
          components.map((component) => (
            <RenderComponent
              key={component.id}
              component={component}
              isSelected={selectedId === component.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

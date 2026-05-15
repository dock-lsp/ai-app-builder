import { useEditorStore } from '@/store/editorStore';
import { ChevronRight, ChevronDown, Layers } from 'lucide-react';
import { useState } from 'react';
import type { ComponentSchema } from '@/types';

export function ComponentTree() {
  const { components, selectedId, selectComponent } = useEditorStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderTreeNode = (component: ComponentSchema, depth: number = 0) => {
    const isExpanded = expandedIds.has(component.id);
    const hasChildren = component.children.length > 0;
    const isSelected = selectedId === component.id;

    return (
      <div key={component.id}>
        <div
          className={`tree-node ${isSelected ? 'active' : ''}`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => selectComponent(component.id)}
        >
          {hasChildren ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(component.id);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span style={{ width: '14px' }} />
          )}
          <Layers size={14} />
          <span>{component.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {component.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="panel" style={{ height: '100%', overflow: 'auto' }}>
      <div className="panel-header">
        <span>组件树</span>
      </div>
      <div className="panel-content" style={{ padding: '8px' }}>
        {components.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px', fontSize: '12px' }}>
            暂无组件
          </div>
        ) : (
          components.map(component => renderTreeNode(component))
        )}
      </div>
    </div>
  );
}

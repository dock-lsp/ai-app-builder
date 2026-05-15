import { useEditorStore } from '@/store/editorStore';
import { componentDefinitions } from './ComponentLibrary';

export function PropertyPanel() {
  const { selectedId, components, updateComponentProps, updateComponentStyle } = useEditorStore();

  const findComponent = (id: string, comps: typeof components): typeof components[0] | null => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children.length > 0) {
        const found = findComponent(id, comp.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedComponent = selectedId ? findComponent(selectedId, components) : null;

  if (!selectedComponent) {
    return (
      <div className="panel" style={{ height: '100%' }}>
        <div className="panel-header">
          <span>属性面板</span>
        </div>
        <div className="panel-content" style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingTop: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
          <div>选择一个组件以编辑属性</div>
        </div>
      </div>
    );
  }

  const definition = componentDefinitions.find(d => d.type === selectedComponent.type);

  const handlePropChange = (name: string, value: any) => {
    updateComponentProps(selectedComponent.id, {
      ...selectedComponent.props,
      [name]: value,
    });
  };

  const handleStyleChange = (property: string, value: string) => {
    updateComponentStyle(selectedComponent.id, {
      ...selectedComponent.style,
      [property]: value,
    });
  };

  return (
    <div className="panel" style={{ height: '100%', overflow: 'auto' }}>
      <div className="panel-header">
        <span>属性: {selectedComponent.name}</span>
      </div>
      <div className="panel-content">
        {/* 组件属性 */}
        {definition?.propDefinitions && definition.propDefinitions.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
              组件属性
            </div>
            {definition.propDefinitions.map(prop => (
              <div key={prop.name} style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  {prop.label}
                </label>
                {prop.type === 'textarea' ? (
                  <textarea
                    className="property-input"
                    value={selectedComponent.props[prop.name] || ''}
                    onChange={(e) => handlePropChange(prop.name, e.target.value)}
                    rows={3}
                  />
                ) : prop.type === 'select' ? (
                  <select
                    className="property-input"
                    value={selectedComponent.props[prop.name] || prop.defaultValue}
                    onChange={(e) => handlePropChange(prop.name, e.target.value)}
                  >
                    {prop.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : prop.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={selectedComponent.props[prop.name] || false}
                    onChange={(e) => handlePropChange(prop.name, e.target.checked)}
                  />
                ) : prop.type === 'color' ? (
                  <input
                    type="color"
                    className="property-input"
                    value={selectedComponent.props[prop.name] || prop.defaultValue}
                    onChange={(e) => handlePropChange(prop.name, e.target.value)}
                  />
                ) : prop.type === 'json' ? (
                  <textarea
                    className="property-input"
                    value={JSON.stringify(selectedComponent.props[prop.name] || prop.defaultValue, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handlePropChange(prop.name, parsed);
                      } catch {}
                    }}
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    className="property-input"
                    value={selectedComponent.props[prop.name] || ''}
                    onChange={(e) => handlePropChange(prop.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 样式属性 */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
            样式设置
          </div>
          
          {/* 布局 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>布局</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <StyleInput label="宽度" value={selectedComponent.style.width} onChange={(v) => handleStyleChange('width', v)} />
              <StyleInput label="高度" value={selectedComponent.style.height} onChange={(v) => handleStyleChange('height', v)} />
              <StyleInput label="内边距" value={selectedComponent.style.padding} onChange={(v) => handleStyleChange('padding', v)} />
              <StyleInput label="外边距" value={selectedComponent.style.margin} onChange={(v) => handleStyleChange('margin', v)} />
            </div>
          </div>

          {/* 外观 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>外观</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>背景色</label>
                <input
                  type="color"
                  className="property-input"
                  value={rgbToHex(selectedComponent.style.backgroundColor as string) || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>文字颜色</label>
                <input
                  type="color"
                  className="property-input"
                  value={rgbToHex(selectedComponent.style.color as string) || '#000000'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                />
              </div>
              <StyleInput label="边框" value={selectedComponent.style.border} onChange={(v) => handleStyleChange('border', v)} />
              <StyleInput label="圆角" value={selectedComponent.style.borderRadius} onChange={(v) => handleStyleChange('borderRadius', v)} />
            </div>
          </div>

          {/* 文字 */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>文字</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <StyleInput label="字号" value={selectedComponent.style.fontSize} onChange={(v) => handleStyleChange('fontSize', v)} />
              <StyleInput label="字重" value={selectedComponent.style.fontWeight} onChange={(v) => handleStyleChange('fontWeight', v)} />
              <StyleInput label="行高" value={selectedComponent.style.lineHeight} onChange={(v) => handleStyleChange('lineHeight', v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StyleInput({ label, value, onChange }: { label: string; value?: string | number; onChange: (value: string) => void }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>{label}</label>
      <input
        type="text"
        className="property-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function rgbToHex(color: string | undefined): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('#')) return color;
  
  const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgb) {
    const r = parseInt(rgb[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgb[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgb[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return undefined;
}

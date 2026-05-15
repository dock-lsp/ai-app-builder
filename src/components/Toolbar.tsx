import { useEditorStore } from '@/store/editorStore';
import { 
  Undo, Redo, Trash2, Eye, Download, 
  Smartphone, Tablet, Monitor, Save,
  ZoomIn, ZoomOut, Maximize, Copy, Clipboard,
  LayoutGrid
} from 'lucide-react';
import { useState } from 'react';
import { UserMenu } from './UserMenu';

interface ToolbarProps {
  onOpenTemplateGallery: () => void;
  onOpenSubscription: () => void;
  onOpenAIModels: () => void;
}

export function Toolbar({ onOpenTemplateGallery, onOpenSubscription, onOpenAIModels }: ToolbarProps) {
  const { 
    undo, redo, historyIndex, history, clearCanvas, exportProject,
    zoom, zoomIn, zoomOut, resetZoom, selectedId, duplicateComponent, copyComponent, pasteComponent, clipboard
  } = useEditorStore();
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showPreview, setShowPreview] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const canPaste = !!clipboard;

  const handleExport = () => {
    const project = exportProject();
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        height: 'var(--header-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      {/* 左侧：Logo 和撤销/重做 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'var(--primary)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
            }}
          >
            AI
          </div>
          App Builder
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <ToolbarButton onClick={undo} disabled={!canUndo} title="撤销 (Ctrl+Z)">
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={redo} disabled={!canRedo} title="重做 (Ctrl+Y)">
            <Redo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={clearCanvas} title="清空画布">
            <Trash2 size={18} />
          </ToolbarButton>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        {/* 复制粘贴 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <ToolbarButton 
            onClick={() => selectedId && duplicateComponent(selectedId)} 
            disabled={!selectedId}
            title="复制组件 (Ctrl+D)"
          >
            <Copy size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => selectedId && copyComponent(selectedId)} 
            disabled={!selectedId}
            title="剪切 (Ctrl+C)"
          >
            <Clipboard size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => pasteComponent(selectedId || undefined)} 
            disabled={!canPaste}
            title="粘贴 (Ctrl+V)"
          >
            <Clipboard size={18} style={{ transform: 'rotate(180deg)' }} />
          </ToolbarButton>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        {/* 模板库按钮 */}
        <button
          onClick={onOpenTemplateGallery}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          <LayoutGrid size={16} />
          模板库
        </button>
      </div>

      {/* 中间：缩放和设备切换 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* 缩放控制 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--background)',
            borderRadius: '6px',
            padding: '2px 8px',
            gap: '4px',
          }}
        >
          <ToolbarButton onClick={zoomOut} title="缩小">
            <ZoomOut size={16} />
          </ToolbarButton>
          <span style={{ fontSize: '13px', minWidth: '50px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <ToolbarButton onClick={zoomIn} title="放大">
            <ZoomIn size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={resetZoom} title="重置">
            <Maximize size={16} />
          </ToolbarButton>
        </div>

        {/* 设备切换 */}
        <div
          style={{
            display: 'flex',
            background: 'var(--background)',
            borderRadius: '6px',
            padding: '2px',
          }}
        >
          <DeviceButton
            active={deviceMode === 'mobile'}
            onClick={() => setDeviceMode('mobile')}
            icon={<Smartphone size={16} />}
            label="手机"
          />
          <DeviceButton
            active={deviceMode === 'tablet'}
            onClick={() => setDeviceMode('tablet')}
            icon={<Tablet size={16} />}
            label="平板"
          />
          <DeviceButton
            active={deviceMode === 'desktop'}
            onClick={() => setDeviceMode('desktop')}
            icon={<Monitor size={16} />}
            label="桌面"
          />
        </div>
      </div>

      {/* 右侧：操作按钮 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye size={16} />
          预览
        </button>
        <button className="btn btn-secondary" onClick={handleExport}>
          <Download size={16} />
          导出
        </button>
        <button className="btn btn-primary">
          <Save size={16} />
          保存
        </button>
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
        <UserMenu onOpenSubscription={onOpenSubscription} onOpenAIModels={onOpenAIModels} />
      </div>
    </div>
  );
}

function ToolbarButton({ 
  onClick, 
  disabled = false, 
  title,
  children 
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        border: 'none',
        background: 'transparent',
        color: disabled ? '#cbd5e1' : 'var(--text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function DeviceButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        borderRadius: '4px',
        border: 'none',
        background: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        fontSize: '13px',
        cursor: 'pointer',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

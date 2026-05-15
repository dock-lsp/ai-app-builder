import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { ComponentLibrary } from './components/ComponentLibrary';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { ComponentTree } from './components/ComponentTree';
import { AIAssistant } from './components/AIAssistant';
import { TemplateGallery } from './components/TemplateGallery';
import { BuildPanel } from './components/BuildPanel';
import { AuthPage } from './pages/AuthPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AIModelSettings } from './pages/AIModelSettings';
import { useAuthStore } from './store/authStore';

function App() {
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAIModelSettingsOpen, setIsAIModelSettingsOpen] = useState(false);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isLoading = useAuthStore(s => s.isLoading);
  const initialize = useAuthStore(s => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // 加载中
  if (isLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f9fafb',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', margin: '0 auto 16px',
            border: '3px solid #e5e7eb', borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '14px', color: '#6b7280' }}>加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录 - 显示登录/注册页
  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => {}} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)} onOpenSubscription={() => setIsSubscriptionOpen(true)} onOpenAIModels={() => setIsAIModelSettingsOpen(true)} />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* 左侧面板 */}
          <div
            style={{
              width: 'var(--sidebar-width)',
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--surface)',
            }}
          >
            <div style={{ flex: 1, overflow: 'auto' }}>
              <ComponentLibrary />
            </div>
            <div style={{ height: '40%', borderTop: '1px solid var(--border)' }}>
              <AIAssistant />
            </div>
          </div>

          {/* 中间画布 */}
          <Canvas />

          {/* 右侧面板 */}
          <div
            style={{
              width: 'var(--panel-width)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--surface)',
            }}
          >
            <div style={{ flex: 1, overflow: 'auto' }}>
              <PropertyPanel />
            </div>
            <div style={{ height: '35%', borderTop: '1px solid var(--border)' }}>
              <ComponentTree />
            </div>
          </div>
        </div>
      </div>

      {/* 模板库弹窗 */}
      <TemplateGallery 
        isOpen={isTemplateGalleryOpen} 
        onClose={() => setIsTemplateGalleryOpen(false)} 
      />
      
      {/* 打包面板 */}
      <BuildPanel />

      {/* 会员订阅页 */}
      {isSubscriptionOpen && (
        <SubscriptionPage onClose={() => setIsSubscriptionOpen(false)} />
      )}

      {/* AI 模型设置 */}
      {isAIModelSettingsOpen && (
        <AIModelSettings onClose={() => setIsAIModelSettingsOpen(false)} />
      )}
    </DndProvider>
  );
}

export default App;

import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { generateProjectFiles } from '@/utils/codeGenerator';
import { Package, Download, Loader2, Check, AlertCircle, Smartphone } from 'lucide-react';
import JSZip from 'jszip';

type BuildStatus = 'idle' | 'generating' | 'building' | 'success' | 'error';

interface BuildState {
  status: BuildStatus;
  progress: number;
  message: string;
  downloadUrl?: string;
  error?: string;
}

export function BuildPanel() {
  const { components } = useEditorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [buildState, setBuildState] = useState<BuildState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [appName, setAppName] = useState('MyApp');
  const [packageName, setPackageName] = useState('com.example.myapp');
  const [version, setVersion] = useState('1.0.0');

  const handleBuild = async () => {
    if (components.length === 0) {
      setBuildState({
        status: 'error',
        progress: 0,
        message: '请先添加一些组件',
        error: '画布为空',
      });
      return;
    }

    setBuildState({
      status: 'generating',
      progress: 10,
      message: '正在生成代码...',
    });

    // 模拟代码生成
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBuildState({
      status: 'building',
      progress: 30,
      message: '正在编译项目...',
    });

    // 模拟编译过程
    const progressInterval = setInterval(() => {
      setBuildState(prev => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return {
          ...prev,
          progress: prev.progress + 10,
          message: prev.progress < 50 ? '正在安装依赖...' : 
                   prev.progress < 70 ? '正在打包资源...' : 
                   '正在生成APK...',
        };
      });
    }, 1000);

    // 模拟完成
    setTimeout(() => {
      clearInterval(progressInterval);
      setBuildState({
        status: 'success',
        progress: 100,
        message: '构建成功！',
        downloadUrl: '#',
      });
    }, 5000);
  };

  const handleDownload = () => {
    // 生成项目文件
    const files = generateProjectFiles(components, {
      appName,
      packageName,
      version,
    });

    // 创建并下载 ZIP
    const zip = new JSZip();
    
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: 'blob' }).then((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appName.toLowerCase().replace(/\s+/g, '-')}-project.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const resetBuild = () => {
    setBuildState({
      status: 'idle',
      progress: 0,
      message: '',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}
        title="打包应用"
      >
        <Package size={24} />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '480px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}
          >
            <Smartphone size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>打包应用</h2>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>生成可安装的 APK 文件</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflow: 'auto' }}>
          {buildState.status === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  应用名称
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={e => setAppName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  包名 (Package Name)
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={e => setPackageName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  格式：com.company.appname
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  版本号
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  构建信息
                </h4>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  组件数量: {components.length} 个
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  输出格式: React Native 项目
                </p>
              </div>
            </div>
          )}

          {(buildState.status === 'generating' || buildState.status === 'building') && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Loader2 size={32} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                {buildState.message}
              </h3>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '16px',
                }}
              >
                <div
                  style={{
                    width: `${buildState.progress}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                {buildState.progress}%
              </p>
            </div>
          )}

          {buildState.status === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={32} style={{ color: '#22c55e' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                构建成功！
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                您的应用已生成，点击下方按钮下载项目文件
              </p>
              <button
                onClick={handleDownload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <Download size={18} />
                下载项目文件
              </button>
            </div>
          )}

          {buildState.status === 'error' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={32} style={{ color: '#ef4444' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                构建失败
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                {buildState.error}
              </p>
              <button
                onClick={resetBuild}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                重试
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {buildState.status === 'idle' && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={handleBuild}
              disabled={components.length === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: components.length === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: components.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              开始构建
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
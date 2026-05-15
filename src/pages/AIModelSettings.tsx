import { useState, useEffect } from 'react';
import {
  Plus, Check, ChevronRight, ChevronLeft,
  Settings, Eye, EyeOff, Loader2, Wifi, WifiOff,
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  modelCount: number;
  models: { id: string; name: string; maxTokens: number }[];
  configFields: { key: string; label: string; type: string; placeholder?: string; required: boolean }[];
  isBuiltIn: boolean;
}

interface UserConfig {
  providerId: string;
  apiKey: string;
  apiBase?: string;
  customModel?: string;
  enabled: boolean;
  isDefault: boolean;
}

interface AIModelSettingsProps {
  onClose: () => void;
}

export function AIModelSettings({ onClose }: AIModelSettingsProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [configs, setConfigs] = useState<UserConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name: '', apiBase: '', apiKey: '', model: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [provRes, configRes] = await Promise.all([
        fetch('http://localhost:3001/api/ai/providers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        }),
        fetch('http://localhost:3001/api/ai/config', {
          headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
        }),
      ]);
      const provData = await provRes.json();
      const configData = await configRes.json();
      if (provData.success) setProviders(provData.data);
      if (configData.success) setConfigs(configData.data);
    } catch {
      // 离线模式 - 使用内置列表
    } finally {
      setLoading(false);
    }
  };

  const getConfig = (providerId: string) => configs.find(c => c.providerId === providerId);

  const handleEdit = (provider: Provider) => {
    const config = getConfig(provider.id);
    setEditingProvider(provider);
    setEditForm({
      apiKey: config?.apiKey || '',
      apiBase: config?.apiBase || provider.configFields.find(f => f.key === 'apiBase')?.placeholder || '',
      customModel: config?.customModel || '',
    });
    setShowApiKey(false);
    setTestResult(null);
  };

  const handleSave = async () => {
    if (!editingProvider) return;
    setSaving(true);
    try {
      await fetch('http://localhost:3001/api/ai/config/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          providerId: editingProvider.id,
          apiKey: editForm.apiKey,
          apiBase: editForm.apiBase || undefined,
          customModel: editForm.customModel || undefined,
          enabled: true,
          isDefault: configs.length === 0,
        }),
      });
      await loadData();
      setEditingProvider(null);
    } catch {
      // 静默处理
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!editingProvider) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('http://localhost:3001/api/ai/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          providerId: editingProvider.id,
          apiKey: editForm.apiKey,
          apiBase: editForm.apiBase || undefined,
        }),
      });
      const data = await res.json();
      setTestResult(data.data);
    } catch {
      setTestResult({ ok: false, message: '网络错误' });
    } finally {
      setTesting(false);
    }
  };

  const handleAddCustom = async () => {
    if (!customForm.name || !customForm.apiBase) return;
    setSaving(true);
    try {
      await fetch('http://localhost:3001/api/ai/config/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          providerId: `custom-${Date.now()}`,
          apiKey: customForm.apiKey,
          apiBase: customForm.apiBase,
          customModel: customForm.model || undefined,
          enabled: true,
        }),
      });
      setShowAddCustom(false);
      setCustomForm({ name: '', apiBase: '', apiKey: '', model: '' });
      await loadData();
    } catch {
      // 静默处理
    } finally {
      setSaving(false);
    }
  };

  // 编辑面板
  if (editingProvider) {
    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={onClose}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '90%', maxWidth: '440px', maxHeight: '85vh', overflow: 'auto', padding: '28px' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${editingProvider.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              {editingProvider.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{editingProvider.name}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{editingProvider.description}</p>
            </div>
          </div>

          {/* 模型选择 */}
          {editingProvider.models.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>选择模型</label>
              <select
                value={editForm.customModel || editingProvider.models[0]?.id || ''}
                onChange={e => setEditForm({ ...editForm, customModel: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', backgroundColor: '#fff' }}
              >
                {editingProvider.models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({(m.maxTokens / 1000).toFixed(0)}K)</option>
                ))}
              </select>
            </div>
          )}

          {/* 配置字段 */}
          {editingProvider.configFields.map(field => (
            <div key={field.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={field.type === 'password' && !showApiKey ? 'password' : 'text'}
                  value={editForm[field.key] || ''}
                  onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }}
                />
                {field.type === 'password' && (
                  <button onClick={() => setShowApiKey(!showApiKey)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* 测试结果 */}
          {testResult && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px', backgroundColor: testResult.ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${testResult.ok ? '#bbf7d0' : '#fecaca'}`, fontSize: '13px', color: testResult.ok ? '#166534' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {testResult.ok ? <Wifi size={16} /> : <WifiOff size={16} />}
              {testResult.message}
            </div>
          )}

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button onClick={() => setEditingProvider(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', fontSize: '14px', cursor: 'pointer', color: '#6b7280' }}>
              取消
            </button>
            <button onClick={handleTest} disabled={testing || !editForm.apiKey} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', fontSize: '14px', cursor: testing ? 'not-allowed' : 'pointer', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {testing ? <Loader2 size={16} className="spin" /> : <Wifi size={16} />}
              测试
            </button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {saving ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 主列表
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', zIndex: 2000 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color="#374151" />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>AI 模型设置</h2>
        <Settings size={20} color="#6b7280" />
      </div>

      {/* 列表 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Loader2 size={32} color="#3b82f6" className="spin" />
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>加载中...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {providers.map(provider => {
              const config = getConfig(provider.id);
              const isConfigured = !!config?.apiKey;
              const isDefault = config?.isDefault;

              return (
                <div
                  key={provider.id}
                  onClick={() => handleEdit(provider)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', backgroundColor: 'white',
                    borderRadius: '12px', cursor: 'pointer',
                    border: isDefault ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* 图标 */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                    backgroundColor: `${provider.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    {provider.icon}
                  </div>

                  {/* 信息 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>{provider.name}</span>
                      {isDefault && (
                        <span style={{ padding: '1px 6px', borderRadius: '4px', backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '10px', fontWeight: '600' }}>默认</span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {provider.models.length} 个模型 · {isConfigured ? '已配置' : '未配置'}
                    </p>
                  </div>

                  {/* 状态 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isConfigured && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    )}
                    <ChevronRight size={18} color="#d1d5db" />
                  </div>
                </div>
              );
            })}

            {/* 自定义添加 */}
            {showAddCustom ? (
              <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #3b82f6' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#1a1a2e' }}>添加自定义模型</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input value={customForm.name} onChange={e => setCustomForm({ ...customForm, name: e.target.value })} placeholder="提供商名称" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
                  <input value={customForm.apiBase} onChange={e => setCustomForm({ ...customForm, apiBase: e.target.value })} placeholder="API Base URL (如 https://api.example.com/v1)" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
                  <input value={customForm.apiKey} onChange={e => setCustomForm({ ...customForm, apiKey: e.target.value })} placeholder="API Key" type="password" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
                  <input value={customForm.model} onChange={e => setCustomForm({ ...customForm, model: e.target.value })} placeholder="模型名称 (可选)" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setShowAddCustom(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', fontSize: '13px', cursor: 'pointer' }}>取消</button>
                    <button onClick={handleAddCustom} disabled={saving || !customForm.name || !customForm.apiBase} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '13px', fontWeight: '600', cursor: saving || !customForm.name || !customForm.apiBase ? 'not-allowed' : 'pointer' }}>
                      {saving ? <Loader2 size={14} className="spin" /> : '添加'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCustom(true)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  border: '1px dashed #d1d5db', background: 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontSize: '14px', color: '#3b82f6', fontWeight: '500',
                }}
              >
                <Plus size={18} />
                添加自定义模型
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

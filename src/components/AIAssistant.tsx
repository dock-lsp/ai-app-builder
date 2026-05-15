import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Sparkles, Send, Loader2, Lightbulb, Wand2, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommend'>('chat');
  const { loadProject, components } = useEditorStore();

  const handleGenerate = async (customPrompt?: string) => {
    const input = customPrompt || prompt;
    if (!input.trim() || isGenerating) return;

    setIsGenerating(true);
    setMessages(prev => [...prev, { role: 'user', content: input, timestamp: new Date() }]);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt: input,
          context: components.length > 0 ? components.slice(0, 5) : undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.components) {
        loadProject(data.data.components);
        const reply = data.data.fallback
          ? '已使用本地模板生成（未配置 DeepSeek API Key）'
          : '已为你生成页面组件！';
        setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '生成失败，请重试', timestamp: new Date() }]);
      }
    } catch {
      // 网络失败时使用本地生成
      const generatedComponents = generateLocalComponents(input);
      loadProject(generatedComponents);
      setMessages(prev => [...prev, { role: 'assistant', content: '已使用本地模板生成', timestamp: new Date() }]);
    } finally {
      setIsGenerating(false);
      if (!customPrompt) setPrompt('');
    }
  };

  const handleRecommend = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentComponents: components,
          action: 'add',
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.map((r: any) => `• ${r.type}: ${r.reason}`).join('\n'),
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '建议添加：图片组件、按钮组件、分割线来丰富页面',
        timestamp: new Date(),
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    { label: '登录页面', prompt: '创建一个登录页面' },
    { label: '商品详情', prompt: '做一个商品详情页' },
    { label: '个人主页', prompt: '生成一个个人主页' },
    { label: '设置页面', prompt: '设计一个设置页面' },
    { label: '数据仪表盘', prompt: '创建一个数据仪表盘' },
    { label: '聊天界面', prompt: '设计一个聊天列表页面' },
  ];

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标签切换 */}
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1, padding: '6px 0', border: 'none', borderRadius: '6px',
            background: activeTab === 'chat' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'chat' ? '#fff' : 'var(--text-secondary)',
            fontSize: '12px', fontWeight: '500', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}
        >
          <Sparkles size={14} /> AI 生成
        </button>
        <button
          onClick={() => setActiveTab('recommend')}
          style={{
            flex: 1, padding: '6px 0', border: 'none', borderRadius: '6px',
            background: activeTab === 'recommend' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'recommend' ? '#fff' : 'var(--text-secondary)',
            fontSize: '12px', fontWeight: '500', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}
        >
          <Lightbulb size={14} /> 智能推荐
        </button>
      </div>

      <div className="panel-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto' }}>
        {activeTab === 'chat' ? (
          <>
            {/* 消息历史 */}
            {messages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflow: 'auto' }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: msg.role === 'user' ? '#eff6ff' : '#f0fdf4',
                      fontSize: '12px',
                      color: msg.role === 'user' ? '#1e40af' : '#166534',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            )}

            {/* 快捷提示 */}
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                快速生成
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(p.prompt)}
                    disabled={isGenerating}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      opacity: isGenerating ? 0.5 : 1,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 输入框 */}
            <div style={{ position: 'relative' }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的页面..."
                disabled={isGenerating}
                style={{
                  width: '100%',
                  minHeight: '70px',
                  padding: '10px 36px 10px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate();
                  }
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || isGenerating}
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: 'none',
                  background: prompt.trim() && !isGenerating ? 'var(--primary)' : '#e2e8f0',
                  color: prompt.trim() && !isGenerating ? '#fff' : '#94a3b8',
                  cursor: prompt.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isGenerating ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
              </button>
            </div>

            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              💡 Ctrl+Enter 快速发送 | 描述越详细效果越好
            </div>
          </>
        ) : (
          /* 智能推荐 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Wand2 size={14} color="var(--primary)" />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  智能分析
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                基于当前画布上 {components.length} 个组件，AI 将为你推荐最合适的下一步操作。
              </p>
            </div>

            <button
              onClick={handleRecommend}
              disabled={isGenerating}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'white',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--text-primary)',
              }}
            >
              {isGenerating ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
              获取推荐
            </button>

            {messages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#f0fdf4',
                      fontSize: '12px',
                      color: '#166534',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 本地组件生成（离线回退）
function generateLocalComponents(prompt: string): any[] {
  const lowerPrompt = prompt.toLowerCase();
  const id = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  if (lowerPrompt.includes('登录') || lowerPrompt.includes('login')) {
    return [
      { id: id(), type: 'container', name: '登录容器', props: {}, style: { padding: 32, backgroundColor: '#ffffff', minHeight: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }, children: [
        { id: id(), type: 'header', name: '欢迎标题', props: { text: '欢迎回来', level: 1 }, style: { color: '#1a1a2e', textAlign: 'center', marginBottom: 8 } },
        { id: id(), type: 'text', name: '副标题', props: { content: '请登录您的账户' }, style: { color: '#6b7280', textAlign: 'center', fontSize: 14, marginBottom: 24 } },
        { id: id(), type: 'input', name: '邮箱输入', props: { label: '邮箱', placeholder: '请输入邮箱' }, style: { width: '100%' } },
        { id: id(), type: 'input', name: '密码输入', props: { label: '密码', placeholder: '请输入密码' }, style: { width: '100%' } },
        { id: id(), type: 'button', name: '登录按钮', props: { text: '登录' }, style: { width: '100%', padding: 14, backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: 10, fontSize: 16, fontWeight: 'bold', marginTop: 8 } },
        { id: id(), type: 'text', name: '注册链接', props: { content: '还没有账户？立即注册' }, style: { color: '#3b82f6', textAlign: 'center', fontSize: 13, marginTop: 8 } },
      ] },
    ];
  }

  if (lowerPrompt.includes('个人') || lowerPrompt.includes('profile')) {
    return [
      { id: id(), type: 'container', name: '个人主页', props: {}, style: { padding: 20, backgroundColor: '#f9fafb', minHeight: 500 }, children: [
        { id: id(), type: 'container', name: '头像区域', props: {}, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 16 }, children: [
          { id: id(), type: 'avatar', name: '用户头像', props: { size: 80, src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user' }, style: { marginBottom: 12 } },
          { id: id(), type: 'header', name: '用户名', props: { text: '张三', level: 2 }, style: { marginBottom: 4 } },
          { id: id(), type: 'text', name: '简介', props: { content: '全栈开发者 | AI 爱好者' }, style: { color: '#6b7280', fontSize: 13 } },
        ] },
        { id: id(), type: 'row', name: '统计数据', props: {}, style: { display: 'flex', justifyContent: 'space-around', padding: 16, backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 16 }, children: [
          { id: id(), type: 'container', name: '关注', props: {}, style: { textAlign: 'center' }, children: [
            { id: id(), type: 'text', name: '关注数', props: { content: '128' }, style: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' } },
            { id: id(), type: 'text', name: '关注标签', props: { content: '关注' }, style: { fontSize: 12, color: '#9ca3af' } },
          ] },
          { id: id(), type: 'container', name: '粉丝', props: {}, style: { textAlign: 'center' }, children: [
            { id: id(), type: 'text', name: '粉丝数', props: { content: '1.2k' }, style: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' } },
            { id: id(), type: 'text', name: '粉丝标签', props: { content: '粉丝' }, style: { fontSize: 12, color: '#9ca3af' } },
          ] },
        ] },
        { id: id(), type: 'button', name: '编辑资料', props: { text: '编辑资料' }, style: { width: '100%', padding: 12, backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: 10, fontSize: 14, fontWeight: '600' } },
      ] },
    ];
  }

  if (lowerPrompt.includes('商品') || lowerPrompt.includes('product')) {
    return [
      { id: id(), type: 'container', name: '商品详情', props: {}, style: { backgroundColor: '#ffffff', minHeight: 500 }, children: [
        { id: id(), type: 'image', name: '商品图片', props: { src: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Product' }, style: { width: '100%', height: 300 } },
        { id: id(), type: 'container', name: '商品信息', props: {}, style: { padding: 16 }, children: [
          { id: id(), type: 'text', name: '价格', props: { content: '¥299.00' }, style: { fontSize: 24, fontWeight: 'bold', color: '#ef4444', marginBottom: 8 } },
          { id: id(), type: 'header', name: '商品名', props: { text: '高品质无线蓝牙耳机', level: 2 }, style: { marginBottom: 8 } },
          { id: id(), type: 'text', name: '描述', props: { content: '主动降噪 | 30小时续航 | 蓝牙5.3' }, style: { color: '#6b7280', fontSize: 13, lineHeight: 1.6, marginBottom: 16 } },
          { id: id(), type: 'divider', name: '分割线', props: {}, style: { marginBottom: 16 } },
        ] },
        { id: id(), type: 'button', name: '购买按钮', props: { text: '立即购买' }, style: { margin: 16, padding: 14, backgroundColor: '#ef4444', color: '#ffffff', borderRadius: 10, fontSize: 16, fontWeight: 'bold' } },
      ] },
    ];
  }

  // 默认
  return [
    { id: id(), type: 'header', name: '标题', props: { text: '新页面', level: 1 }, style: { marginBottom: 16 }, children: [] },
    { id: id(), type: 'text', name: '文本', props: { content: '开始使用 AI App Builder 构建你的应用！' }, style: { color: '#6b7280' }, children: [] },
  ];
}

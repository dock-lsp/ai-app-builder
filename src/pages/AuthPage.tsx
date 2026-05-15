import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  onSuccess: () => void;
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [skipVerify, setSkipVerify] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const login = useAuthStore(s => s.login);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearCountdown();
  }, [clearCountdown]);

  const handleSendCode = async () => {
    if (!email) {
      setError('请先输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('邮箱格式不正确');
      return;
    }

    setError('');
    setSendingCode(true);

    try {
      const res = await authApi.sendEmailCode(email);
      if (res.success) {
        if (res.data?.skipVerify) {
          setSkipVerify(true);
          setError('');
          return;
        }
        // 开始60秒倒计时
        setCountdown(60);
        countdownRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearCountdown();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await authApi.register(email, password, nickname, emailCode || undefined);
        if (res.success && res.data) {
          login(res.data.token, res.data.user);
          onSuccess();
        }
      } else {
        const res = await authApi.login(email, password);
        if (res.success && res.data) {
          login(res.data.token, res.data.user);
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setEmailCode('');
    setSkipVerify(false);
    clearCountdown();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#fff',
    color: '#1a1a2e',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      {/* 背景装饰 */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
            AI App Builder
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            {mode === 'login' ? '登录你的账户，继续创作' : '创建账户，开始你的低代码之旅'}
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#9ca3af',
              }} />
              <input
                type="text"
                placeholder="昵称"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: '#9ca3af',
            }} />
            <input
              type="email"
              placeholder="邮箱地址"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* 验证码输入区域（仅注册模式且未跳过验证时显示） */}
          {mode === 'register' && !skipVerify && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <ShieldCheck size={18} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }} />
                <input
                  type="text"
                  placeholder="邮箱验证码"
                  value={emailCode}
                  onChange={e => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  style={{
                    ...inputStyle,
                    letterSpacing: '4px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0}
                style={{
                  flexShrink: 0,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #667eea',
                  background: countdown > 0 ? '#f8fafc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: countdown > 0 ? '#9ca3af' : 'white',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: sendingCode || countdown > 0 ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '110px',
                  justifyContent: 'center',
                }}
              >
                {sendingCode ? (
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                ) : countdown > 0 ? (
                  `${countdown}s 后重发`
                ) : (
                  '发送验证码'
                )}
              </button>
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: '#9ca3af',
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="密码（至少6位）"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                ...inputStyle,
                paddingRight: '42px',
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '12px', border: 'none',
              background: loading ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : mode === 'login' ? (
              <><LogIn size={18} /> 登录</>
            ) : (
              <><UserPlus size={18} /> 注册</>
            )}
          </button>
        </form>

        {/* 切换模式 */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            {mode === 'login' ? '还没有账户？' : '已有账户？'}
          </span>
          <button
            onClick={switchMode}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#667eea', fontSize: '13px', fontWeight: '600',
              marginLeft: '4px',
            }}
          >
            {mode === 'login' ? '立即注册' : '去登录'}
          </button>
        </div>

        {/* 演示账号提示 */}
        <div style={{
          marginTop: '20px', padding: '12px',
          backgroundColor: '#f0f9ff', borderRadius: '10px',
          border: '1px solid #bae6fd',
          fontSize: '12px', color: '#0369a1', textAlign: 'center',
        }}>
          演示账号：demo@aiappbuilder.com / demo123
        </div>
      </div>
    </div>
  );
}

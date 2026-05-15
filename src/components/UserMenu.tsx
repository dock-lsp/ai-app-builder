import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  Crown, LogOut, Settings, ChevronDown,
  CreditCard, HelpCircle, Bot,
} from 'lucide-react';

interface UserMenuProps {
  onOpenSubscription: () => void;
  onOpenAIModels: () => void;
}

export function UserMenu({ onOpenSubscription, onOpenAIModels }: UserMenuProps) {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const planColors: Record<string, string> = {
    free: '#6b7280',
    pro: '#3b82f6',
    enterprise: '#8b5cf6',
  };

  const planLabels: Record<string, string> = {
    free: '免费版',
    pro: '专业版',
    enterprise: '企业版',
  };

  if (!user) return null;

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px', borderRadius: '8px',
          border: '1px solid #e5e7eb', background: 'white',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${planColors[user.plan]}, ${planColors[user.plan]}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '12px', fontWeight: 'bold',
        }}>
          {user.nickname.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
          {user.nickname}
        </span>
        <span style={{
          padding: '2px 8px', borderRadius: '10px',
          backgroundColor: `${planColors[user.plan]}15`,
          color: planColors[user.plan],
          fontSize: '11px', fontWeight: '600',
        }}>
          {planLabels[user.plan]}
        </span>
        <ChevronDown size={14} color="#9ca3af" />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '8px',
          width: '240px', backgroundColor: 'white',
          borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          border: '1px solid #e5e7eb', overflow: 'hidden', zIndex: 100,
        }}>
          {/* 用户信息 */}
          <div style={{
            padding: '16px', borderBottom: '1px solid #f3f4f6',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${planColors[user.plan]}, ${planColors[user.plan]}cc)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '16px', fontWeight: 'bold',
              }}>
                {user.nickname.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                  {user.nickname}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* 菜单项 */}
          <div style={{ padding: '8px' }}>
            <button
              onClick={() => { onOpenSubscription(); setIsOpen(false); }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#374151',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Crown size={16} color="#f59e0b" />
              升级会员
              {user.plan === 'free' && (
                <span style={{
                  marginLeft: 'auto', padding: '2px 6px',
                  borderRadius: '4px', backgroundColor: '#fef3c7',
                  color: '#d97706', fontSize: '11px',
                }}>
                  推荐
                </span>
              )}
            </button>

            <button
              onClick={() => { onOpenAIModels(); setIsOpen(false); }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#374151',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Bot size={16} color="#8b5cf6" />
              AI 模型设置
            </button>

            <button
              onClick={() => { onOpenSubscription(); setIsOpen(false); }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#374151',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <CreditCard size={16} color="#6b7280" />
              订阅管理
            </button>

            <button
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#374151',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Settings size={16} color="#6b7280" />
              账户设置
            </button>

            <button
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#374151',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <HelpCircle size={16} color="#6b7280" />
              帮助中心
            </button>
          </div>

          {/* 退出登录 */}
          <div style={{ padding: '8px', borderTop: '1px solid #f3f4f6' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#ef4444',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

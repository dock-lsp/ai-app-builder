import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { subscriptionApi, paymentApi } from '@/services/api';
import {
  Crown, Check, Zap, Building2, Star,
  Loader2, X, CreditCard, Smartphone,
} from 'lucide-react';

interface PlanConfig {
  name: string;
  price: number;
  maxProjects: number | string;
  features: string[];
  color: string;
  icon: any;
  popular?: boolean;
}

const PLANS: Record<string, PlanConfig> = {
  free: {
    name: '免费版',
    price: 0,
    maxProjects: 3,
    features: [
      '基础组件库',
      '3个项目',
      '每个项目20个组件',
      '社区模板',
      '基础预览',
    ],
    color: '#6b7280',
    icon: Star,
  },
  pro: {
    name: '专业版',
    price: 29,
    maxProjects: 50,
    features: [
      '全部组件库',
      '50个项目',
      '每个项目200个组件',
      '全部高级模板',
      'React Native 代码导出',
      'AI 智能生成',
      '优先客服支持',
    ],
    color: '#3b82f6',
    icon: Zap,
    popular: true,
  },
  enterprise: {
    name: '企业版',
    price: 99,
    maxProjects: '无限',
    features: [
      '全部组件库',
      '无限项目',
      '无限组件',
      '全部高级模板',
      '代码导出 + 自定义模板',
      'AI 智能生成 + 批量操作',
      '团队协作',
      'API 接入',
      '专属客服',
      '私有化部署支持',
    ],
    color: '#8b5cf6',
    icon: Building2,
  },
};

interface SubscriptionPageProps {
  onClose: () => void;
}

export function SubscriptionPage({ onClose }: SubscriptionPageProps) {
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const [_loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [paymentStep, setPaymentStep] = useState<'select' | 'paying' | 'success'>('select');

  const handleSubscribe = async (planKey: string) => {
    setSelectedPlan(planKey);
    setShowPayment(true);
    setPaymentStep('select');
  };

  const handleConfirmPayment = async () => {
    setLoading(selectedPlan);
    setPaymentStep('paying');

    try {
      // 创建订单
      const orderRes = await paymentApi.createOrder(selectedPlan, paymentMethod);
      if (!orderRes.success) return;

      // 模拟支付回调（生产环境替换为真实支付）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const callbackRes = await paymentApi.simulateCallback(
        orderRes.data!.orderId,
        'success'
      );

      if (callbackRes.success) {
        // 创建订阅
        const subRes = await subscriptionApi.create(selectedPlan, paymentMethod);
        if (subRes.success) {
          // 刷新用户信息
          const { authApi } = await import('@/services/api');
          const meRes = await authApi.getMe();
          if (meRes.success && meRes.data) {
            setUser(meRes.data);
          }
          setPaymentStep('success');
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentStep('select');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '90%',
          maxWidth: showPayment ? '480px' : '900px',
          maxHeight: '85vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '50%',
            border: 'none', background: '#f3f4f6', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <X size={18} color="#6b7280" />
        </button>

        {!showPayment ? (
          /* 计划选择 */
          <div style={{ padding: '40px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                width: '56px', height: '56px', margin: '0 auto 16px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Crown size={28} color="white" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
                升级你的计划
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                解锁更多功能，释放你的创造力
              </p>
              {user && (
                <span style={{
                  display: 'inline-block', marginTop: '8px',
                  padding: '4px 12px', borderRadius: '20px',
                  backgroundColor: '#f3f4f6', fontSize: '12px', color: '#6b7280',
                }}>
                  当前：{PLANS[user.plan]?.name || '免费版'}
                </span>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}>
              {Object.entries(PLANS).map(([key, plan]) => {
                const isCurrent = user?.plan === key;
                const Icon = plan.icon;
                return (
                  <div
                    key={key}
                    style={{
                      border: plan.popular ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '28px 24px',
                      position: 'relative',
                      background: plan.popular ? '#f8faff' : 'white',
                    }}
                  >
                    {plan.popular && (
                      <span style={{
                        position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                        padding: '4px 16px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white', fontSize: '12px', fontWeight: '600',
                      }}>
                        最受欢迎
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        backgroundColor: `${plan.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={22} color={plan.color} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e' }}>
                          {plan.name}
                        </h3>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e' }}>
                        ¥{plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>/月</span>
                      )}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                          <Check size={16} color={plan.color} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => key !== 'free' && handleSubscribe(key)}
                      disabled={isCurrent || key === 'free'}
                      style={{
                        width: '100%', padding: '12px',
                        borderRadius: '10px', border: 'none',
                        background: isCurrent ? '#f3f4f6' :
                          plan.popular ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#1a1a2e',
                        color: isCurrent ? '#9ca3af' : 'white',
                        fontSize: '14px', fontWeight: '600',
                        cursor: isCurrent || key === 'free' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isCurrent ? '当前计划' : key === 'free' ? '免费使用' : '立即订阅'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 支付流程 */
          <div style={{ padding: '40px 32px' }}>
            {paymentStep === 'select' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
                    确认订阅
                  </h2>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {PLANS[selectedPlan]?.name} · ¥{PLANS[selectedPlan]?.price}/月
                  </p>
                </div>

                {/* 支付方式选择 */}
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                    选择支付方式
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setPaymentMethod('wechat')}
                      style={{
                        flex: 1, padding: '16px', borderRadius: '12px',
                        border: paymentMethod === 'wechat' ? '2px solid #07c160' : '1px solid #e5e7eb',
                        background: paymentMethod === 'wechat' ? '#f0fdf4' : 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        backgroundColor: '#07c160', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Smartphone size={20} color="white" />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>微信支付</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>推荐</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('alipay')}
                      style={{
                        flex: 1, padding: '16px', borderRadius: '12px',
                        border: paymentMethod === 'alipay' ? '2px solid #1677ff' : '1px solid #e5e7eb',
                        background: paymentMethod === 'alipay' ? '#eff6ff' : 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        backgroundColor: '#1677ff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CreditCard size={20} color="white" />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>支付宝</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>快捷支付</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 订单摘要 */}
                <div style={{
                  padding: '20px', backgroundColor: '#f9fafb',
                  borderRadius: '12px', marginBottom: '24px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>订阅计划</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>
                      {PLANS[selectedPlan]?.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>计费周期</span>
                    <span style={{ fontSize: '14px', color: '#1a1a2e' }}>月付</span>
                  </div>
                  <div style={{
                    height: '1px', backgroundColor: '#e5e7eb', margin: '12px 0',
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e' }}>应付金额</span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                      ¥{PLANS[selectedPlan]?.price}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowPayment(false)}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px',
                      border: '1px solid #e5e7eb', background: 'white',
                      fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: '#6b7280',
                    }}
                  >
                    返回
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    style={{
                      flex: 2, padding: '14px', borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      color: 'white', fontSize: '14px', fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    确认支付 ¥{PLANS[selectedPlan]?.price}
                  </button>
                </div>
              </>
            )}

            {paymentStep === 'paying' && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Loader2 size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                  正在处理支付...
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>请稍候，正在确认支付结果</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{
                  width: '72px', height: '72px', margin: '0 auto 24px',
                  borderRadius: '50%', backgroundColor: '#dcfce7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={36} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>
                  订阅成功！🎉
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
                  你已成功升级到{PLANS[selectedPlan]?.name}，所有高级功能已解锁
                </p>
                <button
                  onClick={onClose}
                  style={{
                    padding: '14px 40px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  开始使用
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

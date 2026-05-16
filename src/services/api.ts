import { Capacitor } from '@capacitor/core';

// 根据运行环境选择API地址
const isNativePlatform = Capacitor.isNativePlatform();

// 生产环境后端地址
const PROD_API_BASE = 'http://47.92.220.102:3001/api';

// 本地开发/桌面端使用相对路径
const DEV_API_BASE = '/api';

const API_BASE = isNativePlatform ? PROD_API_BASE : DEV_API_BASE;

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // 检查响应内容类型
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('服务器返回格式错误，请检查网络连接');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络设置');
    }
    throw error;
  }
}

// ========== 认证 API ==========
export const authApi = {
  sendEmailCode: (email: string) =>
    request('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  register: (email: string, password: string, nickname: string, emailCode?: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname, emailCode }),
    }),

  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (data: { nickname?: string; avatar?: string }) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// ========== 项目 API ==========
export const projectApi = {
  list: () => request('/projects'),

  get: (id: string) => request(`/projects/${id}`),

  create: (data: { name: string; description?: string; components?: any[] }) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/projects/${id}`, { method: 'DELETE' }),

  export: (id: string) =>
    request(`/projects/${id}/export`, { method: 'POST' }),
};

// ========== 订阅 API ==========
export const subscriptionApi = {
  getPlans: () => request('/subscription/plans'),

  getCurrent: () => request('/subscription/current'),

  create: (plan: string, paymentMethod: string) =>
    request('/subscription/create', {
      method: 'POST',
      body: JSON.stringify({ plan, paymentMethod }),
    }),

  cancel: (id: string) =>
    request(`/subscription/cancel/${id}`, { method: 'POST' }),
};

// ========== 支付 API ==========
export const paymentApi = {
  createOrder: (plan: string, paymentMethod: string) =>
    request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ plan, paymentMethod }),
    }),

  simulateCallback: (orderId: string, status: string) =>
    request('/payment/simulate-callback', {
      method: 'POST',
      body: JSON.stringify({ orderId, status }),
    }),

  getOrderStatus: (orderId: string) =>
    request(`/payment/order/${orderId}`),

  refund: (orderId: string, reason?: string) =>
    request('/payment/refund', {
      method: 'POST',
      body: JSON.stringify({ orderId, reason }),
    }),
};

export default request;

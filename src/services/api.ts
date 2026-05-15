const API_BASE = '/api';

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

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

// ========== 认证 API ==========
export const authApi = {
  register: (email: string, password: string, nickname: string) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
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

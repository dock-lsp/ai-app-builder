// 内存数据存储（生产环境应替换为数据库）
export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  planExpireAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  components: any[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  amount: number;
  createdAt: string;
}

// 用户数据
const users: Map<string, User> = new Map();
const userEmails: Map<string, string> = new Map(); // email -> userId

// 项目数据
const projects: Map<string, Project> = new Map();
const userProjects: Map<string, string[]> = new Map(); // userId -> [projectId]

// 订阅数据
const subscriptions: Map<string, Subscription> = new Map();

// 初始化演示用户
function initDemoData() {
  const demoUser: User = {
    id: 'demo-user-001',
    email: 'demo@aiappbuilder.com',
    password: '$2b$10$rx7GQB7a38tKBpyz4TT7hOMzRsFyrENc5oOs5bG1Dvf6J2BeCOmD2', // password: demo123
    nickname: '演示用户',
    avatar: '',
    plan: 'pro',
    planExpireAt: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
  users.set(demoUser.id, demoUser);
  userEmails.set(demoUser.email, demoUser.id);
}

initDemoData();

// User CRUD
export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'plan'>): User {
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  const user: User = {
    ...userData,
    id,
    plan: 'free',
    createdAt: now,
    updatedAt: now,
  };
  users.set(id, user);
  userEmails.set(user.email, id);
  return user;
}

export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  const userId = userEmails.get(email);
  if (!userId) return undefined;
  return users.get(userId);
}

export function updateUser(id: string, data: Partial<User>): User | undefined {
  const user = users.get(id);
  if (!user) return undefined;
  const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
  users.set(id, updated);
  return updated;
}

// Project CRUD
export function createProject(userId: string, data: { name: string; description?: string; components: any[] }): Project {
  const id = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  const project: Project = {
    id,
    userId,
    name: data.name,
    description: data.description,
    components: data.components,
    createdAt: now,
    updatedAt: now,
  };
  projects.set(id, project);
  
  const userProj = userProjects.get(userId) || [];
  userProj.push(id);
  userProjects.set(userId, userProj);
  
  return project;
}

export function getProjectById(id: string): Project | undefined {
  return projects.get(id);
}

export function getUserProjects(userId: string): Project[] {
  const projectIds = userProjects.get(userId) || [];
  return projectIds.map(id => projects.get(id)).filter(Boolean) as Project[];
}

export function updateProject(id: string, userId: string, data: Partial<Project>): Project | undefined {
  const project = projects.get(id);
  if (!project || project.userId !== userId) return undefined;
  const updated = { ...project, ...data, updatedAt: new Date().toISOString() };
  projects.set(id, updated);
  return updated;
}

export function deleteProject(id: string, userId: string): boolean {
  const project = projects.get(id);
  if (!project || project.userId !== userId) return false;
  projects.delete(id);
  
  const userProj = userProjects.get(userId) || [];
  userProjects.set(userId, userProj.filter(pid => pid !== id));
  
  return true;
}

// Subscription CRUD
export function createSubscription(userId: string, data: { plan: 'free' | 'pro' | 'enterprise'; amount: number; paymentMethod?: string }): Subscription {
  const id = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const endDate = new Date(now);
  
  if (data.plan === 'pro') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (data.plan === 'enterprise') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  
  const subscription: Subscription = {
    id,
    userId,
    plan: data.plan,
    status: 'active',
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    paymentMethod: data.paymentMethod,
    amount: data.amount,
    createdAt: now.toISOString(),
  };
  
  subscriptions.set(id, subscription);
  
  // 更新用户计划
  updateUser(userId, {
    plan: data.plan,
    planExpireAt: endDate.toISOString(),
  });
  
  return subscription;
}

export function getUserSubscription(userId: string): Subscription | undefined {
  for (const sub of subscriptions.values()) {
    if (sub.userId === userId && sub.status === 'active') {
      return sub;
    }
  }
  return undefined;
}

export function cancelSubscription(id: string, userId: string): boolean {
  const sub = subscriptions.get(id);
  if (!sub || sub.userId !== userId) return false;
  sub.status = 'cancelled';
  subscriptions.set(id, sub);
  
  updateUser(userId, { plan: 'free' });
  
  return true;
}

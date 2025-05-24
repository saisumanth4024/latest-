// Re-export all types for easier imports
export * from './product';
export * from './cart';
export * from './user';

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SELLER = 'seller',
  MODERATOR = 'moderator'
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated', 
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

export interface UserCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  permissions?: string[];
  locale?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  initials?: string;
}

export interface ApiActivity {
  id: number;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  user?: string;
}

export interface ApiStatus {
  id: number;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
  uptime: number;
  responseTime: number;
}

export interface Metrics {
  totalUsers: number;
  apiRequests: number;
  avgResponseTime: number;
  errorRate: number;
  activeUsers: number;
  period: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}
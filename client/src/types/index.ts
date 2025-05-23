// User role types
export type UserRole = 'guest' | 'user' | 'admin' | 'seller';

// User status types
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// User profile interface
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

// API Activity interface
export interface ApiActivity {
  id: number;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  user?: string;
}

// API Status interface
export interface ApiStatus {
  id: number;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
  uptime: number;
  responseTime: number;
}

// Metrics interface
export interface Metrics {
  totalUsers: number;
  apiRequests: number;
  avgResponseTime: number;
  errorRate: number;
  activeUsers: number;
  period: string;
}

// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}
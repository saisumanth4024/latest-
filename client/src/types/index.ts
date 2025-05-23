export interface ApiActivity {
  id: number;
  endpoint: string;
  method: string;
  status: number;
  time: string;
}

export interface ApiStatus {
  id: number;
  name: string;
  status: 'operational' | 'degraded' | 'down';
}

export interface Metrics {
  totalUsers: number;
  apiRequests: number;
  avgResponseTime: number;
  errorRate: number;
}

export interface User {
  id: number;
  username: string;
  avatar?: string;
  initials: string;
}

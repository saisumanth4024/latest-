import { ReactNode } from 'react';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
  ORDER = 'order',
  PAYMENT = 'payment',
  PRODUCT = 'product',
  PROMOTION = 'promotion',
  INVENTORY = 'inventory',
  SECURITY = 'security',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationAction {
  label: string;
  url: string;
  type: 'button' | 'link';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  priority?: NotificationPriority;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  sender?: {
    id: string | number;
    name: string;
    avatar?: string;
  };
  recipient?: {
    id: string | number;
    name: string;
  };
  category?: string;
  image?: string;
  icon?: ReactNode;
  actions?: NotificationAction[];
  data?: Record<string, any>;
  metadata?: Record<string, any>;
  url?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sms: boolean;
  marketing: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  systemAlerts: boolean;
  security: boolean;
  newsletter: boolean;
}

export interface NotificationFilterOptions {
  status: NotificationStatus | 'all';
  type: NotificationType | 'all';
  startDate?: string;
  endDate?: string;
  search?: string;
  priority?: NotificationPriority | 'all';
  perPage?: number;
  page?: number;
}
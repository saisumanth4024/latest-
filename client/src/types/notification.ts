export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationCategory {
  SYSTEM = 'system',
  USER = 'user',
  ORDER = 'order',
  PRODUCT = 'product',
  PAYMENT = 'payment',
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
  type: 'link' | 'button';
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  status: NotificationStatus;
  priority: NotificationPriority;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  icon?: string;
  actions?: NotificationAction[];
  image?: string;
  data?: Record<string, any>;
}

export interface NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  categories: {
    [category in NotificationCategory]: {
      enabled: boolean;
      emailEnabled: boolean;
      pushEnabled: boolean;
      smsEnabled: boolean;
      inAppEnabled: boolean;
    };
  };
}

// API Response Types
export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  unreadCount: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface NotificationSettingsResponse {
  settings: NotificationSettings;
}
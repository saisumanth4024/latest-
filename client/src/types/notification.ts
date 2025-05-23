/**
 * Enum for notification types
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
  MARKETING = 'marketing',
  ORDER = 'order',
  PAYMENT = 'payment',
  SHIPPING = 'shipping',
  SECURITY = 'security',
  ACCOUNT = 'account',
}

/**
 * Enum for notification priority
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Enum for notification status
 */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

/**
 * Interface for notification action
 */
export interface NotificationAction {
  /** Action label */
  label: string;
  /** Action URL */
  url?: string;
  /** Action identifier for programmatic handling */
  action?: string;
  /** Action icon */
  icon?: string;
  /** Additional action data */
  data?: Record<string, any>;
  /** Whether this is the primary action */
  isPrimary?: boolean;
}

/**
 * Interface for notifications
 */
export interface Notification {
  /** Unique identifier for the notification */
  id: string | number;
  /** User ID this notification belongs to */
  userId: string | number;
  /** Notification type */
  type: NotificationType;
  /** Notification title */
  title: string;
  /** Notification body */
  body: string;
  /** Notification icon URL or name */
  icon?: string;
  /** Notification image URL */
  imageUrl?: string;
  /** Notification URL */
  url?: string;
  /** Notification priority */
  priority: NotificationPriority;
  /** Notification status */
  status: NotificationStatus;
  /** Whether the notification is read */
  isRead: boolean;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Read timestamp */
  readAt?: string | Date;
  /** Expiration timestamp */
  expiresAt?: string | Date;
  /** Related entity type (e.g., "order", "product") */
  entityType?: string;
  /** Related entity ID */
  entityId?: string | number;
  /** Notification source */
  source?: string;
  /** Available actions */
  actions?: NotificationAction[];
  /** Notification metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for notification preferences
 */
export interface NotificationPreferences {
  /** Email notification preferences */
  email: {
    /** Marketing emails */
    marketing: boolean;
    /** Order status updates */
    orders: boolean;
    /** Account updates */
    account: boolean;
    /** Security alerts */
    security: boolean;
    /** Product updates */
    product: boolean;
  };
  /** In-app notification preferences */
  inApp: {
    /** Marketing notifications */
    marketing: boolean;
    /** Order status updates */
    orders: boolean;
    /** Account updates */
    account: boolean;
    /** Security alerts */
    security: boolean;
    /** Product updates */
    product: boolean;
  };
  /** Push notification preferences */
  push: {
    /** Marketing notifications */
    marketing: boolean;
    /** Order status updates */
    orders: boolean;
    /** Account updates */
    account: boolean;
    /** Security alerts */
    security: boolean;
    /** Product updates */
    product: boolean;
  };
  /** SMS notification preferences */
  sms: {
    /** Marketing messages */
    marketing: boolean;
    /** Order status updates */
    orders: boolean;
    /** Account updates */
    account: boolean;
    /** Security alerts */
    security: boolean;
  };
  /** Quiet hours settings */
  quietHours?: {
    /** Enable quiet hours */
    enabled: boolean;
    /** Start time (24h format, HH:MM) */
    start: string;
    /** End time (24h format, HH:MM) */
    end: string;
    /** Time zone */
    timezone?: string;
  };
  /** Notification frequency */
  frequency?: 'immediate' | 'hourly' | 'daily' | 'weekly';
  /** User-specific overrides */
  overrides?: Record<string, any>;
}
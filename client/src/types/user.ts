/**
 * Interface for user account
 */
export interface User {
  /** Unique identifier for the user */
  id: string | number;
  /** Username */
  username: string;
  /** Email */
  email: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Full name (computed from first and last name) */
  fullName?: string;
  /** User avatar URL */
  avatar?: string;
  /** User role (guest, user, admin, seller) */
  role: string;
  /** User status (active, inactive, suspended, pending) */
  status: string;
  /** User permissions */
  permissions?: string[];
  /** User preferences */
  preferences?: {
    /** UI theme */
    theme?: 'light' | 'dark' | 'system';
    /** UI language */
    language?: string;
    /** Notification preferences */
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    /** User's preferred currency */
    currency?: string;
  };
  /** User locale */
  locale?: string;
  /** User timezone */
  timezone?: string;
  /** Account creation timestamp */
  createdAt?: string;
  /** Account update timestamp */
  updatedAt?: string;
  /** Last login timestamp */
  lastLoginAt?: string;
  /** User initials (computed from name) */
  initials?: string;
  /** Whether the user has verified their email */
  emailVerified?: boolean;
  /** User's phone number */
  phone?: string;
  /** Whether the user has verified their phone */
  phoneVerified?: boolean;
  /** Whether the user has 2FA enabled */
  twoFactorEnabled?: boolean;
  /** Social accounts linked to the user */
  socialAccounts?: {
    provider: string;
    id: string;
    username?: string;
    profileUrl?: string;
    createdAt: string;
  }[];
  /** Account metadata */
  metadata?: Record<string, any>;
}
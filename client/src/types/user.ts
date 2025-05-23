/**
 * Enum for user roles in the application
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SELLER = 'seller',
}

/**
 * User authentication status
 */
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

/**
 * Interface for user profile data
 */
export interface UserProfile {
  /** Unique identifier for the user */
  id: string | number;
  /** Username for display and login */
  username: string;
  /** User's email address */
  email: string;
  /** URL to the user's profile picture */
  avatar?: string;
  /** User's initials for avatar fallback */
  initials: string;
  /** User's full name */
  fullName?: string;
  /** User's role/permission level */
  role: UserRole;
  /** When the user joined */
  createdAt: string | Date;
  /** When the user profile was last updated */
  updatedAt: string | Date;
  /** Whether the user's email is verified */
  emailVerified?: boolean;
  /** User's preferred locale/language */
  locale?: string;
  /** User's timezone */
  timezone?: string;
  /** Custom user preferences */
  preferences?: UserPreferences;
  /** Additional user metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for user preferences
 */
export interface UserPreferences {
  /** UI theme preference */
  theme?: 'light' | 'dark' | 'system';
  /** Notification settings */
  notifications?: {
    email?: boolean;
    push?: boolean;
    inApp?: boolean;
    marketing?: boolean;
  };
  /** Display settings */
  display?: {
    denseMode?: boolean;
    fontSize?: number;
    colorBlindMode?: boolean;
    reduceAnimations?: boolean;
  };
  /** Other user preferences */
  [key: string]: any;
}

/**
 * Interface for user login credentials
 */
export interface UserCredentials {
  /** Username or email for login */
  username: string;
  /** User password */
  password: string;
  /** Remember user session */
  rememberMe?: boolean;
}

/**
 * Interface for user registration data
 */
export interface UserRegistration {
  /** Username for the new account */
  username: string;
  /** Email address for the new account */
  email: string;
  /** Password for the new account */
  password: string;
  /** Password confirmation */
  passwordConfirm: string;
  /** Whether the user agrees to terms and conditions */
  agreeToTerms: boolean;
  /** Optional invitation code */
  inviteCode?: string;
  /** Optional initial user role */
  role?: UserRole;
}

/**
 * Interface for user session data
 */
export interface UserSession {
  /** Session identifier */
  id: string;
  /** User ID associated with the session */
  userId: string | number;
  /** When the session was created */
  createdAt: string | Date;
  /** When the session expires */
  expiresAt: string | Date;
  /** Client IP address */
  ipAddress?: string;
  /** User agent information */
  userAgent?: string;
  /** Whether this is the current active session */
  isCurrent: boolean;
  /** Device information */
  device?: {
    type?: string;
    name?: string;
    os?: string;
    browser?: string;
  };
}

/**
 * Interface for password reset request
 */
export interface PasswordResetRequest {
  /** Email address to send the reset link to */
  email: string;
}

/**
 * Interface for password reset confirmation
 */
export interface PasswordResetConfirmation {
  /** New password */
  password: string;
  /** Password confirmation */
  passwordConfirm: string;
  /** Reset token from the reset link */
  token: string;
}

/**
 * Interface for the authentication state
 */
export interface AuthState {
  /** Current user, if authenticated */
  user: UserProfile | null;
  /** Authentication status */
  status: AuthStatus;
  /** Error message, if authentication failed */
  error: string | null;
  /** Authentication token */
  token: string | null;
  /** When the token expires */
  expiresAt: string | null;
  /** Whether a login is in progress */
  loading: boolean;
}
// Authentication Types
export const UserRole = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin',
  SELLER: 'seller',
  MODERATOR: 'moderator'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
} as const;

export type UserStatusType = typeof UserStatus[keyof typeof UserStatus];

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}
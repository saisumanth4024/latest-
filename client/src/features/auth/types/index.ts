/**
 * Auth Types
 */

export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

export type UserRole = 'guest' | 'user' | 'admin' | 'seller';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  error: string | null;
  lastLoginAttempt?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: string | undefined;
}
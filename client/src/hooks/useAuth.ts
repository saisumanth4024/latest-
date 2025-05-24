import { useAppSelector } from '@/app/hooks';
import { 
  selectAuthUser, 
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '@/features/auth/authSlice';

/**
 * Custom hook for authentication
 * Provides authentication status and user data
 */
export function useAuth() {
  const user = useAppSelector(selectAuthUser);
  const authStatus = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    authStatus
  };
}
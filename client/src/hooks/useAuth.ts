import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectAuthUser, 
  selectAuthStatus, 
  selectIsAuthenticated,
  selectAuthLoading,
  validateUserToken
} from '@/features/auth/authSlice';
import { AuthStatus } from '@/features/auth/types';

/**
 * Custom hook for authentication
 * Provides authentication status and user data
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  // Check token validity on mount
  useEffect(() => {
    if (status === AuthStatus.IDLE) {
      dispatch(validateUserToken());
    }
  }, [dispatch, status]);

  return {
    user,
    status,
    isAuthenticated,
    isLoading
  };
}
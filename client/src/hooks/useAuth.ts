import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { 
  selectAuthUser, 
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  fetchReplitUser
} from '@/features/auth/authSlice';

/**
 * Enhanced auth hook that supports both traditional and Replit authentication methods
 * Automatically attempts to fetch user data via Replit auth if no user is authenticated
 */
export function useAuth() {
  const user = useAppSelector(selectAuthUser);
  const authStatus = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const dispatch = useAppDispatch();

  // Check for Replit authentication if no user is authenticated in Redux store
  useEffect(() => {
    // Only try to fetch Replit user if not already authenticated and not already loading
    if (!isAuthenticated && !isLoading && !error) {
      // Attempt to fetch user from Replit auth endpoint
      dispatch(fetchReplitUser());
    }
  }, [isAuthenticated, isLoading, error, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    authStatus
  };
}
import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { 
  selectAuthUser, 
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  fetchReplitUser,
  logout
} from '@/features/auth/authSlice';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Check for Replit authentication if no user is authenticated in Redux store
  useEffect(() => {
    // Only try to fetch Replit user if not already authenticated and not already loading
    if (!isAuthenticated && !isLoading && !error) {
      // Attempt to fetch user from Replit auth endpoint
      dispatch(fetchReplitUser());
    }
  }, [isAuthenticated, isLoading, error, dispatch]);

  // Logout handler with callback for better performance
  const handleLogout = useCallback(() => {
    try {
      dispatch(logout());
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out of your account",
        variant: "default",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive",
      });
    }
  }, [dispatch, toast]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    authStatus,
    logout: handleLogout
  };
}
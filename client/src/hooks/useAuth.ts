import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { 
  selectAuthUser, 
  selectAuthStatus,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  logout
} from '@/features/auth/authSlice';
import { useToast } from '@/hooks/use-toast';

/**
 * Authentication hook that provides access to the auth state
 * and authentication-related functionality
 */
export function useAuth() {
  const user = useAppSelector(selectAuthUser);
  const authStatus = useAppSelector(selectAuthStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

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
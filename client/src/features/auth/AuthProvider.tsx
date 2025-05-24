import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  checkTokenExpiration, 
  refreshToken, 
  selectAuthError,
  selectAuthStatus,
  setAuthState
} from './authSlice';
import { useToast } from '@/hooks/useToast';
import { AuthStatus } from '@/types';
import { useModal } from '@/hooks/useModal';
import { localStorage } from '@/utils/storage';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages global authentication state, session expiration,
 * and automatic token refresh.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const toast = useToast();
  const modal = useModal();
  
  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.get('auth');
    if (savedAuth) {
      const { token, refreshToken, expiresAt, user } = savedAuth;
      
      // Check if token is still valid
      if (expiresAt && new Date(expiresAt) > new Date()) {
        dispatch(setAuthState({ token, refreshToken, expiresAt, user }));
      } else {
        // Token expired, try refresh
        dispatch(refreshToken());
      }
    }
  }, [dispatch]);
  
  // Set up token expiration check
  useEffect(() => {
    // Initial check
    dispatch(checkTokenExpiration());
    
    // Set up interval to check token expiration
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Handle authentication errors
  useEffect(() => {
    if (authError && authStatus === AuthStatus.ERROR) {
      // Show toast notification for auth errors
      toast.error({
        title: 'Authentication Error',
        description: authError
      });
    }
  }, [authError, authStatus, toast]);
  
  // Handle session expiration
  useEffect(() => {
    if (authStatus === AuthStatus.UNAUTHENTICATED) {
      // Check if we previously had a valid session that expired
      const lastSessionCheck = window.localStorage.getItem('lastSessionCheck');
      const now = new Date().getTime();
      
      if (lastSessionCheck) {
        const parsedCheck = JSON.parse(lastSessionCheck);
        if (parsedCheck && parsedCheck.wasAuthenticated) {
          // Only show the session expired modal if the last check was recent
          // and the user was previously authenticated
          const timeSinceLastCheck = now - parsedCheck.timestamp;
          
          if (timeSinceLastCheck < 5 * 60 * 1000) { // 5 minutes
            modal.alert({
              title: 'Session Expired',
              message: 'Your session has expired. Please log in again to continue.'
            });
          }
        }
      }
      
      // Update last session check
      window.localStorage.setItem('lastSessionCheck', JSON.stringify({
        timestamp: now,
        wasAuthenticated: false
      }));
    } else if (authStatus === AuthStatus.AUTHENTICATED) {
      // Update last session check
      window.localStorage.setItem('lastSessionCheck', JSON.stringify({
        timestamp: new Date().getTime(),
        wasAuthenticated: true
      }));
    }
  }, [authStatus, modal]);
  
  return <>{children}</>;
}

export default AuthProvider;
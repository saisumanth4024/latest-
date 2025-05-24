import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectAuthError, 
  selectIsAuthenticated,
  setCredentials,
  fetchReplitUser
} from './authSlice';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/hooks/useModal';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages global authentication state and handles errors
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authError = useAppSelector(selectAuthError);
  const { toast } = useToast();
  const modal = useModal();
  
  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      toast({
        title: 'Authentication Error',
        description: authError,
        variant: 'destructive'
      });
    }
  }, [authError, toast]);
  
  // Handle session state changes
  useEffect(() => {
    const lastSessionState = localStorage.getItem('last_session_state');
    const wasAuthenticated = lastSessionState ? JSON.parse(lastSessionState).authenticated : false;
    
    // If user was authenticated before but isn't now, show session expired notification
    if (wasAuthenticated && !isAuthenticated) {
      modal.alert({
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again to continue.'
      });
    }
    
    // Update session state
    localStorage.setItem('last_session_state', JSON.stringify({
      authenticated: isAuthenticated,
      timestamp: new Date().getTime()
    }));
  }, [isAuthenticated, modal]);
  
  return <>{children}</>;
}

export default AuthProvider;
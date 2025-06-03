import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { 
  selectIsAuthenticated, 
  selectAuthLoading, 
  selectUser, 
  selectAuthError,
  selectUserRole,
  checkTokenExpiration,
  login as loginAction,
  logout as logoutAction,
  signup as signupAction,
  refreshToken as refreshTokenAction,
  setAuthState,
  googleLogin as googleLoginAction,
  githubLogin as githubLoginAction
} from './authSlice';
import { UserCredentials, UserRegistration, UserRole, UserProfile } from '@/types';
import { localStorage } from '@/utils/storage';
import { canAccessRoute, getPermissionsForRole, Permission } from './rbac';
import { useToast } from '@/hooks/useToast';

/**
 * Hook to manage authentication state and operations
 * 
 * @returns Authentication state and methods
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectUser);
  const error = useAppSelector(selectAuthError);
  const userRole = useAppSelector(selectUserRole);
  const toast = useToast();
  
  // Check token expiration on mount and set interval
  useEffect(() => {
    // Initial check
    dispatch(checkTokenExpiration());
    
    // Set up interval to check token expiration
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      const savedAuth = localStorage.get('auth');
      if (savedAuth) {
        const { token, refreshToken, expiresAt, user } = savedAuth;
        
        // Check if token is still valid
        if (expiresAt && new Date(expiresAt) > new Date()) {
          dispatch(setAuthState({ token, refreshToken, expiresAt, user }));
        } else {
          // Token expired, try refresh
          dispatch(refreshTokenAction());
        }
      }
    }
  }, [dispatch, isAuthenticated]);
  
  // Login method
  const login = async (credentials: UserCredentials) => {
    const resultAction = await dispatch(
      loginAction({
        email: (credentials as any).email || credentials.username,
        password: credentials.password,
        rememberMe: (credentials as any).rememberMe ?? credentials.remember,
      })
    );
    
    if (loginAction.fulfilled.match(resultAction)) {
      toast.success({ 
        title: 'Login Successful', 
        description: `Welcome back${user?.username ? `, ${user.username}` : ''}!`
      });
      return true;
    } else {
      toast.error({ 
        title: 'Login Failed', 
        description: resultAction.payload as string || 'An error occurred during login'
      });
      return false;
    }
  };
  
  // Signup method
  const signup = async (registrationData: UserRegistration) => {
    const resultAction = await dispatch(signupAction(registrationData));
    
    if (signupAction.fulfilled.match(resultAction)) {
      toast.success({ 
        title: 'Signup Successful', 
        description: 'Your account has been created successfully!'
      });
      return true;
    } else {
      toast.error({
        title: 'Signup Failed',
        description: resultAction.payload as string || 'An error occurred during signup'
      });
      return false;
    }
  };
  
  // Logout method
  const logout = async () => {
    const resultAction = await dispatch(logoutAction());
    
    if (logoutAction.fulfilled.match(resultAction)) {
      toast.info({ 
        title: 'Logged Out', 
        description: 'You have been logged out successfully'
      });
      return true;
    }
    
    return false;
  };
  
  // Google login method
  const googleLogin = async (tokenId: string) => {
    const resultAction = await dispatch(googleLoginAction(tokenId));
    
    if (googleLoginAction.fulfilled.match(resultAction)) {
      toast.success({ 
        title: 'Login Successful', 
        description: 'You have been logged in with Google'
      });
      return true;
    } else {
      toast.error({
        title: 'Google Login Failed',
        description: resultAction.payload as string || 'An error occurred during Google login'
      });
      return false;
    }
  };
  
  // GitHub login method
  const githubLogin = async (code: string) => {
    const resultAction = await dispatch(githubLoginAction(code));
    
    if (githubLoginAction.fulfilled.match(resultAction)) {
      toast.success({ 
        title: 'Login Successful', 
        description: 'You have been logged in with GitHub'
      });
      return true;
    } else {
      toast.error({
        title: 'GitHub Login Failed',
        description: resultAction.payload as string || 'An error occurred during GitHub login'
      });
      return false;
    }
  };
  
  // Method to check if user can access a specific route
  const canAccess = (path: string) => {
    return canAccessRoute(path, userRole);
  };
  
  // Get user permissions based on role
  const getUserPermissions = (): Permission[] => {
    return getPermissionsForRole(userRole);
  };
  
  // Check if user has specific permission
  const hasPermission = (permission: Permission): boolean => {
    const permissions = getUserPermissions();
    return permissions.includes(permission);
  };
  
  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    userRole,
    login,
    logout,
    signup,
    googleLogin,
    githubLogin,
    canAccess,
    getUserPermissions,
    hasPermission,
  };
}

/**
 * Hook to handle automatic redirection after login
 */
export function useAuthRedirect() {
  const [, setLocation] = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Handle redirect after login
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        setLocation(redirectPath);
      }
      
      // Check if there's a returnTo query param
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      if (returnTo) {
        setLocation(decodeURIComponent(returnTo));
      }
    }
  }, [isAuthenticated, setLocation]);
  
  return null;
}

export default { useAuth, useAuthRedirect };
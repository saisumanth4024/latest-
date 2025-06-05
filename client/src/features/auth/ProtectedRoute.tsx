import { ReactNode, useEffect } from 'react';
import { useLocation, useRoute, Redirect } from '@/router/wouterCompat';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated, selectUserRole } from './authSlice';
import { canAccessRoute } from './rbac';
import { useToast } from '@/hooks/useToast';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  /** Child components to render if access is allowed */
  children: ReactNode;
  /** Redirect path if access is denied (defaults to /login) */
  redirectTo?: string;
  /** Fallback component to render when checking permissions */
  fallback?: ReactNode;
  /** Specific roles that can access this route (optional) */
  roles?: UserRole[];
}

/**
 * A component that protects routes based on authentication status and RBAC permissions
 * 
 * @example
 * ```tsx
 * // Basic protection that just requires authentication
 * <Route path="/profile">
 *   <ProtectedRoute>
 *     <ProfilePage />
 *   </ProtectedRoute>
 * </Route>
 * 
 * // Protection with specific roles
 * <Route path="/admin/dashboard">
 *   <ProtectedRoute roles={[UserRole.ADMIN]}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 * </Route>
 * ```
 */
function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  fallback = null,
  roles
}: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  const [location, setLocation] = useLocation();
  const toast = useToast();
  
  // Get the matched route
  const [, params] = useRoute(location);
  
  // Store the current URL with params to redirect back after login
  useEffect(() => {
    if (!isAuthenticated) {
      // Save intended destination, including query params
      const fullPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterLogin', fullPath);
    }
  }, [isAuthenticated, location]);
  
  // Check if the user can access this route based on the path and their role
  const { canAccess, redirectTo: rbacRedirectTo } = canAccessRoute(location, userRole);
  
  // If manual roles were provided, check against those as well
  const hasRequiredRole = !roles || roles.includes(userRole);
  
  // If user cannot access or doesn't have required role, redirect
  if (!isAuthenticated || !canAccess || !hasRequiredRole) {
    // Show toast notification if user is logged in but doesn't have permissions
    if (isAuthenticated && (!canAccess || !hasRequiredRole)) {
      toast.error({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.'
      });
    }
    
    // Determine where to redirect
    const finalRedirectTo = rbacRedirectTo || redirectTo;
    
    // Add the current path as a returnTo parameter for better UX
    const encodedReturnTo = encodeURIComponent(location);
    const redirectPath = finalRedirectTo.includes('?') 
      ? `${finalRedirectTo}&returnTo=${encodedReturnTo}`
      : `${finalRedirectTo}?returnTo=${encodedReturnTo}`;
    
    return <Redirect to={redirectPath} />;
  }
  
  // User is authenticated and has access - render the protected route
  return <>{children}</>;
}

export default ProtectedRoute;
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { selectImpersonationStatus } from '../adminSlice';
import { Role, Permission } from '../types';
import { 
  Resource, 
  Action, 
  hasPermission, 
  getAccessLevel,
  AccessLevel
} from './rbacConfig';

// Get the current authenticated user's permissions
export function usePermissions() {
  // Get user from auth state
  const user = useSelector((state: RootState) => state.auth.user);
  const { isImpersonating, impersonatedUserId } = useSelector(selectImpersonationStatus);
  
  // If impersonating, get the impersonated user's role
  const effectiveUser = isImpersonating ? { 
    id: impersonatedUserId || '',
    role: { 
      permissions: [] // This should be populated with the impersonated user's permissions
    } as Role
  } : user;
  
  // Get user permissions (or empty array if not authenticated)
  const permissions = effectiveUser?.role?.permissions || [];
  
  /**
   * Check if user has permission to perform an action on a resource
   */
  const can = (
    resource: Resource,
    action: Action,
    resourceOwnerId?: string
  ): boolean => {
    if (!effectiveUser) return false;
    
    return hasPermission(
      permissions, 
      resource, 
      action, 
      resourceOwnerId, 
      effectiveUser.id
    );
  };
  
  /**
   * Determine a component's access level based on permissions
   */
  const getComponentAccess = (
    resource: Resource,
    requiredAction: Action = Action.READ,
    resourceOwnerId?: string
  ): AccessLevel => {
    if (!effectiveUser) return AccessLevel.HIDDEN;
    
    return getAccessLevel(
      permissions,
      resource,
      requiredAction,
      resourceOwnerId,
      effectiveUser.id
    );
  };
  
  /**
   * Check if component should be rendered based on permissions
   */
  const shouldRender = (
    resource: Resource,
    requiredAction: Action = Action.READ,
    resourceOwnerId?: string
  ): boolean => {
    const access = getComponentAccess(resource, requiredAction, resourceOwnerId);
    return access !== AccessLevel.HIDDEN;
  };
  
  /**
   * Check if component should be enabled based on permissions
   */
  const isEnabled = (
    resource: Resource,
    requiredAction: Action = Action.READ,
    resourceOwnerId?: string
  ): boolean => {
    const access = getComponentAccess(resource, requiredAction, resourceOwnerId);
    return access === AccessLevel.FULL;
  };
  
  /**
   * Check if component should be read-only based on permissions
   */
  const isReadOnly = (
    resource: Resource,
    requiredAction: Action = Action.UPDATE,
    resourceOwnerId?: string
  ): boolean => {
    const access = getComponentAccess(resource, requiredAction, resourceOwnerId);
    return access === AccessLevel.READONLY;
  };
  
  return {
    permissions,
    can,
    getComponentAccess,
    shouldRender,
    isEnabled,
    isReadOnly,
    isImpersonating,
    user: effectiveUser,
  };
}
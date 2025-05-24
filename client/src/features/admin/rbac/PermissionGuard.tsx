import React, { ReactNode } from 'react';
import { usePermissions } from './usePermissions';
import { Resource, Action, AccessLevel } from './rbacConfig';

interface PermissionGuardProps {
  resource: Resource;
  action: Action;
  resourceOwnerId?: string;
  children: ReactNode;
  fallback?: ReactNode;
  renderDisabled?: boolean;
  renderReadOnly?: boolean;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action,
  resourceOwnerId,
  children,
  fallback = null,
  renderDisabled = false,
  renderReadOnly = false,
}) => {
  const { getComponentAccess } = usePermissions();
  const accessLevel = getComponentAccess(resource, action, resourceOwnerId);
  
  // If access is HIDDEN and no fallback is provided, render nothing
  if (accessLevel === AccessLevel.HIDDEN && !fallback) {
    return null;
  }
  
  // If access is HIDDEN but fallback is provided, render fallback
  if (accessLevel === AccessLevel.HIDDEN) {
    return <>{fallback}</>;
  }
  
  // If access is DISABLED and we don't want to render disabled components, show fallback
  if (accessLevel === AccessLevel.DISABLED && !renderDisabled && fallback) {
    return <>{fallback}</>;
  }
  
  // If access is READ_ONLY and we don't want to render read-only components, show fallback
  if (accessLevel === AccessLevel.READONLY && !renderReadOnly && fallback) {
    return <>{fallback}</>;
  }
  
  // Otherwise, render children
  return <>{children}</>;
};

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  resource: Resource;
  action: Action;
  resourceOwnerId?: string;
  showTooltip?: boolean;
  readOnlyMessage?: string;
  forbiddenMessage?: string;
}

/**
 * Button that's automatically disabled based on user permissions
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  resource,
  action,
  resourceOwnerId,
  children,
  disabled,
  showTooltip = true,
  readOnlyMessage = "You have read-only access to this resource",
  forbiddenMessage = "You don't have permission to perform this action",
  ...props
}) => {
  const { getComponentAccess } = usePermissions();
  const accessLevel = getComponentAccess(resource, action, resourceOwnerId);
  
  // Don't render if hidden
  if (accessLevel === AccessLevel.HIDDEN) {
    return null;
  }
  
  // Determine if button should be disabled based on access level and 'disabled' prop
  const isDisabled = disabled || accessLevel !== AccessLevel.FULL;
  
  // Determine tooltip message
  const tooltipMessage = accessLevel === AccessLevel.READONLY 
    ? readOnlyMessage 
    : forbiddenMessage;
  
  return (
    <button
      disabled={isDisabled}
      title={isDisabled && showTooltip ? tooltipMessage : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

interface ProtectedRouteProps {
  resource: Resource;
  action?: Action;
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Component that protects a route based on user permissions
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  resource,
  action = Action.READ,
  children,
  redirectTo = "/admin/unauthorized",
}) => {
  const { shouldRender } = usePermissions();
  const canAccess = shouldRender(resource, action);
  
  if (!canAccess) {
    // Use navigate from wouter to redirect
    window.location.href = redirectTo;
    return null;
  }
  
  return <>{children}</>;
};
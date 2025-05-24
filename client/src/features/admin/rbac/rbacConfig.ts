import { Permission } from '../types';

/**
 * Resource types within the application
 */
export enum Resource {
  USERS = 'users',
  ROLES = 'roles',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  SETTINGS = 'settings',
  ANALYTICS = 'analytics',
  AUDIT_LOGS = 'audit_logs',
  SCHEDULED_JOBS = 'scheduled_jobs',
  CATEGORIES = 'categories',
  SELLERS = 'sellers',
  PAYMENTS = 'payments',
  REVIEWS = 'reviews',
  INVENTORY = 'inventory',
}

/**
 * Action types that can be performed on resources
 */
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage', // Full access (includes create, read, update, delete)
  APPROVE = 'approve',
  REJECT = 'reject',
  EXPORT = 'export',
  IMPORT = 'import',
}

/**
 * Predefined roles in the system
 */
export enum PredefinedRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONTENT_EDITOR = 'content_editor',
  CUSTOMER_SUPPORT = 'customer_support',
  SELLER = 'seller',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * Permission matrix defining what each role can do
 */
export const rolePermissionMatrix: Record<PredefinedRole, { resource: Resource; actions: Action[] }[]> = {
  [PredefinedRole.SUPER_ADMIN]: [
    // Super admin has full access to everything
    ...Object.values(Resource).map(resource => ({
      resource,
      actions: [Action.MANAGE],
    })),
  ],
  
  [PredefinedRole.ADMIN]: [
    // Admin has full access to most resources
    { resource: Resource.USERS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE] },
    { resource: Resource.ROLES, actions: [Action.READ] },
    { resource: Resource.PRODUCTS, actions: [Action.MANAGE] },
    { resource: Resource.ORDERS, actions: [Action.MANAGE] },
    { resource: Resource.SETTINGS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.ANALYTICS, actions: [Action.READ] },
    { resource: Resource.AUDIT_LOGS, actions: [Action.READ] },
    { resource: Resource.SCHEDULED_JOBS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.CATEGORIES, actions: [Action.MANAGE] },
    { resource: Resource.SELLERS, actions: [Action.READ, Action.UPDATE, Action.APPROVE, Action.REJECT] },
    { resource: Resource.PAYMENTS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.REVIEWS, actions: [Action.READ, Action.DELETE] },
    { resource: Resource.INVENTORY, actions: [Action.MANAGE] },
  ],
  
  [PredefinedRole.MANAGER]: [
    { resource: Resource.USERS, actions: [Action.READ] },
    { resource: Resource.PRODUCTS, actions: [Action.READ, Action.UPDATE, Action.APPROVE, Action.REJECT] },
    { resource: Resource.ORDERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.ANALYTICS, actions: [Action.READ] },
    { resource: Resource.CATEGORIES, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.SELLERS, actions: [Action.READ, Action.APPROVE, Action.REJECT] },
    { resource: Resource.PAYMENTS, actions: [Action.READ] },
    { resource: Resource.REVIEWS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.INVENTORY, actions: [Action.READ, Action.UPDATE] },
  ],
  
  [PredefinedRole.CONTENT_EDITOR]: [
    { resource: Resource.PRODUCTS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.CATEGORIES, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.REVIEWS, actions: [Action.READ, Action.UPDATE] },
  ],
  
  [PredefinedRole.CUSTOMER_SUPPORT]: [
    { resource: Resource.USERS, actions: [Action.READ] },
    { resource: Resource.ORDERS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.REVIEWS, actions: [Action.READ, Action.UPDATE] },
    { resource: Resource.PAYMENTS, actions: [Action.READ] },
  ],
  
  [PredefinedRole.SELLER]: [
    { resource: Resource.PRODUCTS, actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE], scope: 'own' },
    { resource: Resource.ORDERS, actions: [Action.READ, Action.UPDATE], scope: 'own' },
    { resource: Resource.ANALYTICS, actions: [Action.READ], scope: 'own' },
    { resource: Resource.INVENTORY, actions: [Action.READ, Action.UPDATE], scope: 'own' },
    { resource: Resource.PAYMENTS, actions: [Action.READ], scope: 'own' },
    { resource: Resource.REVIEWS, actions: [Action.READ], scope: 'own' },
  ],
  
  [PredefinedRole.USER]: [
    // Regular users typically don't have access to admin features
  ],
  
  [PredefinedRole.GUEST]: [
    // Guests have no access to admin features
  ],
};

/**
 * Convert permission matrix to a flat array of permissions
 */
export function generatePermissionsFromMatrix(): Permission[] {
  const uniquePermissions = new Map<string, Permission>();
  
  // Current timestamp
  const now = new Date().toISOString();
  
  // Generate a unique ID for each permission
  let permissionId = 1;
  
  // Process the role permission matrix
  Object.values(rolePermissionMatrix).forEach(rolePermissions => {
    rolePermissions.forEach(({ resource, actions }) => {
      actions.forEach(action => {
        const key = `${resource}:${action}`;
        
        if (!uniquePermissions.has(key)) {
          uniquePermissions.set(key, {
            id: permissionId.toString(),
            name: key,
            description: `Permission to ${action} ${resource}`,
            resource,
            action: action as any,
            createdAt: now,
            updatedAt: now,
            isSystem: true,
          });
          
          permissionId++;
        }
      });
    });
  });
  
  return Array.from(uniquePermissions.values());
}

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
  userPermissions: Permission[],
  resource: Resource,
  action: Action,
  resourceOwnerId?: string,
  userId?: string,
): boolean {
  // Check for manage permission first (it includes all other actions)
  const hasManagePermission = userPermissions.some(
    p => p.resource === resource && p.action === Action.MANAGE
  );
  
  if (hasManagePermission) {
    return true;
  }
  
  // Check for specific action permission
  const hasSpecificPermission = userPermissions.some(
    p => p.resource === resource && p.action === action
  );
  
  if (hasSpecificPermission) {
    // For 'own' scoped resources, verify the user is the owner
    if (resourceOwnerId && userId) {
      return resourceOwnerId === userId;
    }
    return true;
  }
  
  return false;
}

/**
 * Define access levels for UI components
 */
export enum AccessLevel {
  HIDDEN = 'hidden',      // Component is not rendered at all
  DISABLED = 'disabled',  // Component is rendered but disabled
  READONLY = 'readonly',  // Component is rendered in read-only mode
  FULL = 'full',          // Component is fully accessible
}

/**
 * Determine component access level based on user permissions
 */
export function getAccessLevel(
  userPermissions: Permission[],
  resource: Resource,
  requiredAction: Action = Action.READ,
  resourceOwnerId?: string,
  userId?: string,
): AccessLevel {
  if (hasPermission(userPermissions, resource, requiredAction, resourceOwnerId, userId)) {
    return AccessLevel.FULL;
  }
  
  if (hasPermission(userPermissions, resource, Action.READ, resourceOwnerId, userId)) {
    return AccessLevel.READONLY;
  }
  
  return AccessLevel.HIDDEN;
}
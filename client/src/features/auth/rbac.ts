import { UserRole } from '@/types';

/**
 * Type for permission names used throughout the application
 */
export type Permission = 
  // User management
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  
  // Product management
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  
  // Order management
  | 'orders:read'
  | 'orders:create'
  | 'orders:update'
  | 'orders:refund'
  | 'orders:cancel'
  
  // Dashboard access
  | 'dashboard:access'
  | 'dashboard:analytics'
  | 'dashboard:reports'
  
  // Inventory management
  | 'inventory:read'
  | 'inventory:update'
  
  // Category management
  | 'categories:read'
  | 'categories:create'
  | 'categories:update'
  | 'categories:delete'
  
  // Settings management
  | 'settings:read'
  | 'settings:update'
  
  // Customer support
  | 'support:read'
  | 'support:respond'
  | 'support:escalate'
  
  // Content management
  | 'content:read'
  | 'content:create'
  | 'content:update'
  | 'content:delete'
  
  // Seller specific
  | 'seller:profile'
  | 'seller:products'
  | 'seller:orders'
  | 'seller:analytics';

/**
 * Role-based permission configuration
 * Maps each role to its allowed permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    'products:read',
    'categories:read',
    'content:read',
  ],
  
  [UserRole.USER]: [
    // User has all guest permissions
    'products:read',
    'categories:read',
    'content:read',
    
    // Plus their own specific permissions
    'orders:create',
    'orders:read',
    'users:read',  // Can read their own profile
    'users:update', // Can update their own profile
    'support:read',
    'support:respond',
  ],
  
  [UserRole.SELLER]: [
    // Seller has all user permissions
    'products:read',
    'categories:read',
    'content:read',
    'orders:create',
    'orders:read',
    'users:read',
    'users:update',
    'support:read',
    'support:respond',
    
    // Plus their seller-specific permissions
    'products:create',
    'products:update',
    'seller:profile',
    'seller:products',
    'seller:orders',
    'seller:analytics',
    'dashboard:access',
    'inventory:read',
    'inventory:update',
  ],
  
  [UserRole.ADMIN]: [
    // Admin has all permissions
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'orders:read',
    'orders:create',
    'orders:update',
    'orders:refund',
    'orders:cancel',
    'dashboard:access',
    'dashboard:analytics',
    'dashboard:reports',
    'inventory:read',
    'inventory:update',
    'categories:read',
    'categories:create',
    'categories:update',
    'categories:delete',
    'settings:read',
    'settings:update',
    'support:read',
    'support:respond',
    'support:escalate',
    'content:read',
    'content:create',
    'content:update',
    'content:delete',
    'seller:profile',
    'seller:products',
    'seller:orders',
    'seller:analytics',
  ],
};

/**
 * Configuration for routes that require authentication
 */
export interface RouteConfig {
  /** Whether the route requires authentication */
  requireAuth: boolean;
  /** Required permissions to access this route (if any) */
  permissions?: Permission[];
  /** Required roles to access this route (if any) */
  roles?: UserRole[];
  /** Whether to redirect the user if they don't have proper access */
  redirectTo?: string;
}

/**
 * Configuration for all app routes
 * Maps route paths to their auth requirements
 */
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Public routes
  '/': {
    requireAuth: false,
  },
  '/dashboard': {
    requireAuth: true,
    permissions: ['dashboard:access'],
    redirectTo: '/login',
  },
  '/login': {
    requireAuth: false,
  },
  '/signup': {
    requireAuth: false,
  },
  '/products': {
    requireAuth: false,
  },
  '/products/:id': {
    requireAuth: false,
  },
  '/categories': {
    requireAuth: false,
  },
  
  // User routes
  '/profile': {
    requireAuth: true,
    permissions: ['users:read'],
    redirectTo: '/login',
  },
  '/orders': {
    requireAuth: true,
    permissions: ['orders:read'],
    redirectTo: '/login',
  },
  '/checkout': {
    requireAuth: true,
    permissions: ['orders:create'],
    redirectTo: '/login',
  },
  
  // Seller routes
  '/seller/dashboard': {
    requireAuth: true,
    roles: [UserRole.SELLER, UserRole.ADMIN],
    permissions: ['seller:profile', 'dashboard:access'],
    redirectTo: '/login',
  },
  '/seller/products': {
    requireAuth: true,
    roles: [UserRole.SELLER, UserRole.ADMIN],
    permissions: ['seller:products', 'products:read'],
    redirectTo: '/login',
  },
  '/seller/orders': {
    requireAuth: true,
    roles: [UserRole.SELLER, UserRole.ADMIN],
    permissions: ['seller:orders', 'orders:read'],
    redirectTo: '/login',
  },
  
  // Admin routes
  '/admin/dashboard': {
    requireAuth: true,
    roles: [UserRole.ADMIN],
    permissions: ['dashboard:access', 'dashboard:analytics'],
    redirectTo: '/login',
  },
  '/admin/users': {
    requireAuth: true,
    roles: [UserRole.ADMIN],
    permissions: ['users:read'],
    redirectTo: '/login',
  },
  '/admin/products': {
    requireAuth: true,
    roles: [UserRole.ADMIN],
    permissions: ['products:read', 'products:update', 'products:create'],
    redirectTo: '/login',
  },
  '/admin/orders': {
    requireAuth: true,
    roles: [UserRole.ADMIN],
    permissions: ['orders:read', 'orders:update'],
    redirectTo: '/login',
  },
  '/admin/settings': {
    requireAuth: true,
    roles: [UserRole.ADMIN],
    permissions: ['settings:read', 'settings:update'],
    redirectTo: '/login',
  },
};

/**
 * Check if a user has permission to access a resource
 * 
 * @param userPermissions - The user's permissions
 * @param requiredPermissions - The permissions required for access
 * @returns Whether the user has the required permissions
 */
export function hasPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  if (!requiredPermissions.length) return true;
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

/**
 * Check if a user has a specific role
 * 
 * @param userRole - The user's role
 * @param requiredRoles - The roles required for access
 * @returns Whether the user has one of the required roles
 */
export function hasRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  if (!requiredRoles.length) return true;
  return requiredRoles.includes(userRole);
}

/**
 * Get all permissions for a user based on their role
 * 
 * @param role - The user's role
 * @returns Array of permissions for that role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a user can access a route based on their role and permissions
 * 
 * @param path - The route path to check
 * @param userRole - The user's role
 * @returns Whether the user can access the route and redirect path if not
 */
export function canAccessRoute(
  path: string,
  userRole: UserRole
): { canAccess: boolean; redirectTo?: string } {
  // Find the matching route configuration
  // First try exact match
  let routeConfig = ROUTE_CONFIG[path];
  
  // If no exact match, try to find a matching parametric route
  if (!routeConfig) {
    const pathParts = path.split('/');
    const routeKeys = Object.keys(ROUTE_CONFIG);
    
    for (const routeKey of routeKeys) {
      const routeParts = routeKey.split('/');
      
      if (routeParts.length !== pathParts.length) continue;
      
      let isMatch = true;
      for (let i = 0; i < routeParts.length; i++) {
        // Skip if route part is a parameter (starts with :)
        if (routeParts[i].startsWith(':')) continue;
        
        // Compare route parts
        if (routeParts[i] !== pathParts[i]) {
          isMatch = false;
          break;
        }
      }
      
      if (isMatch) {
        routeConfig = ROUTE_CONFIG[routeKey];
        break;
      }
    }
  }
  
  // If no route config found, default to not requiring auth
  if (!routeConfig) {
    return { canAccess: true };
  }
  
  // If route doesn't require auth, anyone can access
  if (!routeConfig.requireAuth) {
    return { canAccess: true };
  }
  
  // Check role requirements if specified
  if (routeConfig.roles && !hasRole(userRole, routeConfig.roles)) {
    return {
      canAccess: false,
      redirectTo: routeConfig.redirectTo || '/',
    };
  }
  
  // Check permission requirements if specified
  if (routeConfig.permissions) {
    const userPermissions = getPermissionsForRole(userRole);
    if (!hasPermissions(userPermissions, routeConfig.permissions)) {
      return {
        canAccess: false,
        redirectTo: routeConfig.redirectTo || '/',
      };
    }
  }
  
  // User passed all checks
  return { canAccess: true };
}

export default {
  ROLE_PERMISSIONS,
  ROUTE_CONFIG,
  hasPermissions,
  hasRole,
  getPermissionsForRole,
  canAccessRoute,
};
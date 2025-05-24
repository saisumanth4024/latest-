export type UserRole = 'guest' | 'user' | 'admin' | 'seller' | 'moderator';

export interface NavItem {
  title: string;
  path: string;
  icon: string;
  roles: UserRole[];
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Export icon identifiers
export const ICONS = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  SEARCH: 'search',
  ANALYTICS: 'analytics',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  ADMIN: 'admin',
  SELLER: 'seller'
};

// This will be used to generate the navigation structure
export const navigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: ICONS.DASHBOARD,
        roles: ['guest', 'user', 'admin', 'seller']
      },
      {
        title: 'Products',
        path: '/products',
        icon: ICONS.PRODUCTS,
        roles: ['user', 'admin', 'seller']
      },
      {
        title: 'Orders',
        path: '/orders',
        icon: ICONS.ORDERS,
        roles: ['user', 'admin', 'seller']
      },
      {
        title: 'Search',
        path: '/search',
        icon: ICONS.SEARCH,
        roles: ['guest', 'user', 'admin', 'seller']
      },
      {
        title: 'Analytics',
        path: '/analytics',
        icon: ICONS.ANALYTICS,
        roles: ['admin', 'seller']
      }
    ]
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Profile',
        path: '/profile',
        icon: ICONS.PROFILE,
        roles: ['user', 'admin', 'seller']
      },
      {
        title: 'Settings',
        path: '/settings',
        icon: ICONS.SETTINGS,
        roles: ['user', 'admin', 'seller']
      },
      {
        title: 'Admin',
        path: '/admin',
        icon: ICONS.ADMIN,
        roles: ['admin']
      },
      {
        title: 'Seller Dashboard',
        path: '/seller',
        icon: ICONS.SELLER,
        roles: ['seller']
      }
    ]
  }
];

// Helper function to filter navigation items based on user role
export function getNavigationByRole(role: UserRole): NavSection[] {
  return navigation.map(section => ({
    ...section,
    items: section.items.filter(item => item.roles.includes(role))
  })).filter(section => section.items.length > 0);
}
/**
 * Advanced TypeScript Types and Patterns
 * 
 * This file contains advanced TypeScript types used throughout the application.
 */

// ------ Generic Types ------

/**
 * Represents an item with an ID and display properties
 */
export interface Identifiable {
  id: string | number;
  name: string;
  description?: string;
}

/**
 * Represents a selectable item
 */
export interface Selectable {
  selected?: boolean;
  disabled?: boolean;
}

// ------ Discriminated Unions ------

/**
 * Base notification type
 */
export interface BaseNotification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

/**
 * Toast notification type
 */
export interface ToastNotification extends BaseNotification {
  type: 'toast';
  duration: number;
  variant: 'success' | 'error' | 'warning' | 'info';
}

/**
 * Modal notification type
 */
export interface ModalNotification extends BaseNotification {
  type: 'modal';
  size: 'small' | 'medium' | 'large';
  actions: {
    label: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'destructive';
  }[];
}

/**
 * In-app notification type
 */
export interface InAppNotification extends BaseNotification {
  type: 'in-app';
  link?: string;
  icon?: string;
}

/**
 * Union type of all notification types
 */
export type NotificationType = ToastNotification | ModalNotification | InAppNotification;

// Type guard for notification types
export const isToastNotification = (notification: NotificationType): notification is ToastNotification => {
  return notification.type === 'toast';
};

export const isModalNotification = (notification: NotificationType): notification is ModalNotification => {
  return notification.type === 'modal';
};

export const isInAppNotification = (notification: NotificationType): notification is InAppNotification => {
  return notification.type === 'in-app';
};

// ------ API Response Types ------

/**
 * Generic API response with success/error discrimination
 */
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Type guard for API response
export function isSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.status === 'success';
}

// ------ UI State Types ------

export type UiStateIdle = {
  status: 'idle';
};

export type UiStateLoading = {
  status: 'loading';
  progress?: number;
};

export type UiStateSuccess<T> = {
  status: 'success';
  data: T;
  timestamp: number;
};

export type UiStateError = {
  status: 'error';
  error: string;
  code?: string;
};

export type UiStateEmpty = {
  status: 'empty';
  message?: string;
};

export type UiState<T> =
  | UiStateIdle
  | UiStateLoading
  | UiStateSuccess<T>
  | UiStateError
  | UiStateEmpty;

// ------ Utility Types ------

/**
 * Makes all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties of T nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Extracts the value type from a Record/object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts keys of T that have values of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// ------ Mapped Types ------

/**
 * Creates a type for form errors based on a form data type
 */
export type FormErrors<T> = {
  [K in keyof T]?: T[K] extends object ? FormErrors<T[K]> : string;
};

/**
 * Makes all properties and nested properties readonly
 */
export type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};

/**
 * Creates a type with only required properties from T
 */
export type RequiredProps<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

// ------ Template Literal Types ------

/**
 * HTTP method type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * CSS property type
 */
export type CssProperty = `--${string}` | `${string}-color` | `${string}-size` | `${string}-width` | `${string}-height`;

/**
 * API endpoint type
 */
export type ApiEndpoint = `/api/${string}`;

/**
 * Route param type
 */
export type RouteParam<Route extends string> = 
  Route extends `${infer Start}:${infer Param}/${infer Rest}` 
    ? Param | RouteParam<`${Start}${Rest}`> 
    : Route extends `${infer Start}:${infer Param}` 
      ? Param 
      : never;

// ------ Mock Data Types ------

/**
 * Product entity for examples
 */
export interface Product extends Identifiable, Selectable {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  rating: number;
  imageUrl?: string;
}

/**
 * User entity for examples
 */
export interface User extends Identifiable, Selectable {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  lastLogin?: Date;
  avatar?: string;
}

/**
 * Order entity for examples
 */
export interface Order extends Identifiable {
  id: string;
  name: string;
  orderNumber: string;
  customer: User;
  products: Product[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  shippingAddress?: string;
}

// Sample data for examples
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro X',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    tags: ['laptop', 'premium', 'work'],
    inStock: true,
    rating: 4.7,
    imageUrl: 'https://example.com/laptop.jpg'
  },
  {
    id: '2',
    name: 'Smartphone Ultra',
    description: 'Next-generation smartphone with advanced features',
    price: 899.99,
    category: 'Electronics',
    tags: ['smartphone', 'mobile', 'premium'],
    inStock: true,
    rating: 4.5,
    imageUrl: 'https://example.com/smartphone.jpg'
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 249.99,
    category: 'Audio',
    tags: ['headphones', 'wireless', 'audio'],
    inStock: false,
    rating: 4.3,
    imageUrl: 'https://example.com/headphones.jpg'
  }
];

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    permissions: ['read', 'write', 'delete'],
    lastLogin: new Date('2023-01-15'),
    avatar: 'https://example.com/john.jpg'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    permissions: ['read', 'write'],
    lastLogin: new Date('2023-01-14'),
    avatar: 'https://example.com/jane.jpg'
  }
];

export const sampleNotifications: NotificationType[] = [
  {
    id: '1',
    type: 'toast',
    title: 'Success!',
    message: 'Your changes have been saved successfully.',
    createdAt: new Date('2023-01-15'),
    read: false,
    duration: 3000,
    variant: 'success'
  },
  {
    id: '2',
    type: 'modal',
    title: 'Confirm Action',
    message: 'Are you sure you want to delete this item?',
    createdAt: new Date('2023-01-14'),
    read: false,
    size: 'medium',
    actions: [
      { label: 'Cancel', action: 'cancel', variant: 'secondary' },
      { label: 'Delete', action: 'delete', variant: 'destructive' }
    ]
  },
  {
    id: '3',
    type: 'in-app',
    title: 'New Message',
    message: 'You have a new message from Jane Smith.',
    createdAt: new Date('2023-01-13'),
    read: true,
    link: '/messages/123',
    icon: 'message'
  }
];
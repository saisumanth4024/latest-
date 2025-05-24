// User Management Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'banned' | 'pending';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  metadata?: Record<string, any>;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleId: string;
  status?: 'active' | 'inactive' | 'pending';
  profileImageUrl?: string;
  phoneNumber?: string;
}

export interface UpdateUserRequest {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  status?: 'active' | 'inactive' | 'banned' | 'pending';
  profileImageUrl?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Role & Permission Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isSystem: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  createdAt: string;
  updatedAt: string;
  isSystem: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissionIds: string[];
  isDefault?: boolean;
}

export interface UpdateRoleRequest {
  id: string;
  name?: string;
  description?: string;
  permissionIds?: string[];
  isDefault?: boolean;
}

// Product Management Types
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  inventory: {
    available: number;
    reserved: number;
    total: number;
  };
  category: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
    alt?: string;
    position: number;
  }[];
  variants?: AdminProductVariant[];
  attributes: {
    name: string;
    value: string;
  }[];
  status: 'active' | 'draft' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  sellerId?: string;
  sellerName?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalNotes?: string;
  taxable: boolean;
  taxCode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  shippingRequired: boolean;
  metadata?: Record<string, any>;
}

export interface AdminProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  inventory: {
    available: number;
    reserved: number;
    total: number;
  };
  options: {
    name: string;
    value: string;
  }[];
  imageId?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  inventoryQuantity: number;
  categoryId: string;
  subcategoryId?: string;
  brandId?: string;
  images?: {
    url: string;
    alt?: string;
    position: number;
  }[];
  attributes?: {
    name: string;
    value: string;
  }[];
  status: 'active' | 'draft';
  tags?: string[];
  taxable: boolean;
  taxCode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  shippingRequired: boolean;
  metadata?: Record<string, any>;
  sellerId?: string;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  inventoryQuantity?: number;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  images?: {
    id?: string;
    url: string;
    alt?: string;
    position: number;
  }[];
  attributes?: {
    name: string;
    value: string;
  }[];
  status?: 'active' | 'draft' | 'archived';
  tags?: string[];
  taxable?: boolean;
  taxCode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  shippingRequired?: boolean;
  metadata?: Record<string, any>;
}

// Settings Types
export interface AppSettings {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    logoUrl: string;
    faviconUrl: string;
    contactEmail: string;
    supportEmail: string;
    phoneNumber?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
    };
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  legal: {
    termsUrl: string;
    privacyUrl: string;
    refundUrl: string;
    shippingUrl: string;
    cookiePolicy: string;
    companyName: string;
    companyRegistration: string;
    vatNumber?: string;
  };
  payment: {
    currency: string;
    currencySymbol: string;
    currencyPosition: 'before' | 'after';
    thousandSeparator: string;
    decimalSeparator: string;
    decimalPrecision: number;
    gateways: {
      stripe: {
        enabled: boolean;
        testMode: boolean;
      };
      paypal: {
        enabled: boolean;
        testMode: boolean;
      };
    };
    taxSettings: {
      enabled: boolean;
      taxIncluded: boolean;
      defaultTaxRate: number;
    };
  };
  email: {
    fromName: string;
    fromEmail: string;
    headerImage: string;
    footerText: string;
    templates: {
      welcome: {
        subject: string;
        enabled: boolean;
      };
      orderConfirmation: {
        subject: string;
        enabled: boolean;
      };
      orderShipped: {
        subject: string;
        enabled: boolean;
      };
      passwordReset: {
        subject: string;
        enabled: boolean;
      };
    };
  };
  notifications: {
    adminNewOrder: boolean;
    adminNewUser: boolean;
    adminLowStock: boolean;
    adminProductReview: boolean;
  };
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Job Types
export interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  cronExpression: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  lastRunStatus?: 'success' | 'failed';
  lastRunError?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
/**
 * Advanced TypeScript types for the products feature
 * 
 * This file enhances the existing products functionality with
 * generic components, discriminated unions, utility types, and
 * advanced TypeScript patterns.
 */

// ------ Generic Base Types ------

/**
 * Base type for all entities with an ID
 */
export interface Entity<T = string> {
  id: T;
}

/**
 * Base type for anything with a name
 */
export interface Named {
  name: string;
}

/**
 * Base type for sortable entities
 */
export interface Sortable {
  sortOrder?: number;
}

/**
 * Base type for entities with timestamps
 */
export interface Timestamped {
  createdAt: Date;
  updatedAt?: Date;
}

// ------ Advanced Generic Product Types ------

/**
 * Generic product interface - can be extended for different product types
 */
export interface GenericProduct<T = string> extends Entity<T>, Named, Timestamped {
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl?: string;
}

/**
 * Physical product with inventory and shipping properties
 */
export interface PhysicalProduct extends GenericProduct {
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  inventoryCount: number;
  shippingRestrictions?: string[];
}

/**
 * Digital product with download and license properties
 */
export interface DigitalProduct extends GenericProduct {
  fileSize: number;
  fileFormat: string;
  downloadUrl: string;
  licenseType: 'personal' | 'commercial' | 'enterprise';
  expiryDays?: number;
}

/**
 * Subscription product with recurring billing
 */
export interface SubscriptionProduct extends GenericProduct {
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  trialDays: number;
  features: string[];
  cancellationPolicy?: string;
}

/**
 * Union type of all product types
 */
export type Product = PhysicalProduct | DigitalProduct | SubscriptionProduct;

// ------ Discriminated Unions for Product States ------

/**
 * Product availability states using discriminated union pattern
 */
export type ProductAvailabilityState = 
  | { status: 'in-stock'; quantity: number }
  | { status: 'low-stock'; quantity: number; reorderDate: Date }
  | { status: 'out-of-stock'; backorderAvailable: boolean; expectedDate?: Date }
  | { status: 'discontinued'; alternativeIds?: string[] };

/**
 * Product pricing states using discriminated union pattern
 */
export type ProductPricingState =
  | { type: 'regular'; price: number }
  | { type: 'sale'; originalPrice: number; salePrice: number; endDate: Date }
  | { type: 'clearance'; originalPrice: number; clearancePrice: number }
  | { type: 'member-only'; memberPrice: number; regularPrice: number };

// ------ Utility Types for Product Management ------

/**
 * Makes all product properties optional for partial updates
 */
export type PartialProduct<T extends GenericProduct> = Partial<T>;

/**
 * Creates product update payload with only specified fields
 */
export type ProductUpdatePayload<T extends GenericProduct, K extends keyof T> = Pick<T, K>;

/**
 * Product creation type that omits system-generated fields
 */
export type CreateProductPayload<T extends GenericProduct> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// ------ Advanced Filter Types with Generics ------

/**
 * Generic filter type for any entity
 */
export interface Filter<T> {
  field: keyof T;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'between';
  value: any;
}

/**
 * Product-specific filter type
 */
export type ProductFilter = Filter<GenericProduct>;

/**
 * Type-safe filter builder for products
 */
export function createProductFilter<K extends keyof GenericProduct>(
  field: K,
  operator: Filter<GenericProduct>['operator'],
  value: GenericProduct[K]
): ProductFilter {
  return { field, operator, value };
}

// ------ Type Guards ------

/**
 * Type guard for physical products
 */
export function isPhysicalProduct(product: Product): product is PhysicalProduct {
  return 'weight' in product && 'dimensions' in product;
}

/**
 * Type guard for digital products
 */
export function isDigitalProduct(product: Product): product is DigitalProduct {
  return 'fileSize' in product && 'downloadUrl' in product;
}

/**
 * Type guard for subscription products
 */
export function isSubscriptionProduct(product: Product): product is SubscriptionProduct {
  return 'billingCycle' in product && 'trialDays' in product;
}

// ------ Mapped Types for UI State ------

/**
 * Creates form validation errors type from product type
 */
export type ProductValidationErrors<T extends GenericProduct> = {
  [K in keyof T]?: string;
};

/**
 * Creates a readonly version of product data for display
 */
export type ReadonlyProduct<T extends GenericProduct> = {
  readonly [K in keyof T]: T[K];
};

// ------ Search Result Types with Generics ------

/**
 * Generic search result interface
 */
export interface SearchResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Product search result specialization
 */
export type ProductSearchResult = SearchResult<GenericProduct>;

/**
 * Search parameters with generic type safety
 */
export interface SearchParams<T> {
  query?: string;
  filters?: Filter<T>[];
  sort?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  };
  page?: number;
  pageSize?: number;
}

/**
 * Product search parameters specialization
 */
export type ProductSearchParams = SearchParams<GenericProduct>;

// ------ State Management Types ------

/**
 * Generic resource state using discriminated unions
 */
export type ResourceState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

/**
 * Product state specialization
 */
export type ProductState = ResourceState<GenericProduct>;

/**
 * Collection state using generics
 */
export type CollectionState<T> = ResourceState<T[]>;

/**
 * Product collection state specialization
 */
export type ProductsState = CollectionState<GenericProduct>;

// ------ Conditional Types for Feature Flags ------

/**
 * Conditional types based on feature flags
 */
export type ConditionalFeature<Feature extends boolean, T, F = null> = Feature extends true ? T : F;

/**
 * Reviews feature conditionally included in product display
 */
export type WithReviews<HasReviews extends boolean> = ConditionalFeature<
  HasReviews,
  { reviews: { rating: number; count: number; items: any[] } }
>;

/**
 * Extended product with conditional features
 */
export type ExtendedProduct<
  HasReviews extends boolean = false,
  HasVariants extends boolean = false
> = GenericProduct & 
  WithReviews<HasReviews> & 
  ConditionalFeature<HasVariants, { variants: any[] }>;
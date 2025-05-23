// Types Barrel Export

// User Types
export {
  UserRole,
  AuthStatus
} from './user';
export type {
  UserProfile,
  UserPreferences,
  UserCredentials,
  UserRegistration,
  UserSession,
  PasswordResetRequest,
  PasswordResetConfirmation,
  AuthState
} from './user';

// Product Types
export {
  InventoryStatus
} from './product';
export type {
  Product,
  ProductCategory,
  ProductTag,
  ProductVariant,
  ProductVariantOption,
  ProductReview,
  ProductPricing,
  ProductMetadata,
  ProductMedia
} from './product';

// Order Types
export {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ShippingMethod
} from './order';
export type {
  Order,
  OrderItem,
  OrderShipping,
  OrderPayment,
  OrderTotals,
  OrderNote,
  OrderHistoryEntry,
  Address,
  TaxInfo,
  DiscountInfo
} from './order';

// Cart Types
export type {
  Cart,
  CartItem,
  CartTotals,
  CartCoupon,
  ShippingOption
} from './cart';

// Notification Types
export {
  NotificationType,
  NotificationPriority,
  NotificationStatus
} from './notification';
export type {
  Notification,
  NotificationAction,
  NotificationPreferences
} from './notification';

// Search Types
export {
  SearchResultType
} from './search';
export type {
  SearchResult,
  BaseSearchResult,
  ProductSearchResult,
  UserSearchResult,
  OrderSearchResult,
  CategorySearchResult,
  PageSearchResult,
  BlogSearchResult,
  CustomSearchResult,
  SearchParams,
  SearchResponse,
  SearchFilter,
  SearchSortOption,
  SearchPagination
} from './search';
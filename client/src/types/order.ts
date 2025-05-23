import { Product, ProductVariant } from './product';

/**
 * Enum for order status
 */
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  FAILED = 'failed',
}

/**
 * Enum for payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  AUTHORIZED = 'authorized',
  PAID = 'paid',
  PARTIALLY_REFUNDED = 'partially_refunded',
  REFUNDED = 'refunded',
  FAILED = 'failed',
  VOIDED = 'voided',
}

/**
 * Enum for payment methods
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  STORE_CREDIT = 'store_credit',
  CRYPTOCURRENCY = 'cryptocurrency',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

/**
 * Enum for shipping methods
 */
export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
  PICKUP = 'pickup',
  DIGITAL = 'digital',
  FREIGHT = 'freight',
}

/**
 * Interface for address information
 */
export interface Address {
  /** Full name of the recipient */
  fullName: string;
  /** Company name (optional) */
  company?: string;
  /** First line of address */
  line1: string;
  /** Second line of address (optional) */
  line2?: string;
  /** City */
  city: string;
  /** State or province */
  state: string;
  /** Postal or ZIP code */
  postalCode: string;
  /** Country */
  country: string;
  /** Phone number */
  phone: string;
  /** Email address */
  email?: string;
  /** Whether this is a residential address */
  isResidential?: boolean;
  /** Address type (billing, shipping, etc.) */
  type?: 'billing' | 'shipping' | 'both';
  /** Additional address instructions */
  instructions?: string;
  /** Whether this is the default address */
  isDefault?: boolean;
}

/**
 * Interface for tax information
 */
export interface TaxInfo {
  /** Tax rate applied */
  rate: number;
  /** Tax amount */
  amount: number;
  /** Tax description or name */
  description: string;
  /** Tax jurisdiction */
  jurisdiction?: string;
  /** Tax category */
  category?: string;
}

/**
 * Interface for discount information
 */
export interface DiscountInfo {
  /** Discount code or coupon */
  code?: string;
  /** Discount amount */
  amount: number;
  /** Discount type */
  type: 'percentage' | 'fixed' | 'free_shipping';
  /** Discount description */
  description: string;
}

/**
 * Interface for order item
 */
export interface OrderItem {
  /** Unique identifier for the order item */
  id: string | number;
  /** Order ID this item belongs to */
  orderId: string | number;
  /** Product ID */
  productId: string | number;
  /** Product information snapshot */
  product: Partial<Product>;
  /** Product variant ID */
  variantId?: string | number;
  /** Product variant information snapshot */
  variant?: Partial<ProductVariant>;
  /** Quantity ordered */
  quantity: number;
  /** Unit price at time of order */
  unitPrice: number;
  /** Subtotal (unit price × quantity) */
  subtotal: number;
  /** Total discounts applied to this item */
  discountTotal: number;
  /** Total tax for this item */
  taxTotal: number;
  /** Final total for this item */
  total: number;
  /** Item-specific discounts */
  discounts?: DiscountInfo[];
  /** Item-specific taxes */
  taxes?: TaxInfo[];
  /** Item options (color, size, etc.) */
  options?: Record<string, string>;
  /** SKU of the product */
  sku: string;
  /** Whether the item is a digital product */
  isDigital: boolean;
  /** Whether the item has been shipped */
  isShipped?: boolean;
  /** Whether the item has been delivered */
  isDelivered?: boolean;
  /** Whether the item has been refunded */
  isRefunded?: boolean;
  /** Whether the item requires shipping */
  requiresShipping: boolean;
  /** Item weight for shipping */
  weight?: number;
  /** Item gift message */
  giftMessage?: string;
  /** Item metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for order shipping information
 */
export interface OrderShipping {
  /** Shipping address */
  address: Address;
  /** Shipping method */
  method: ShippingMethod;
  /** Shipping carrier */
  carrier?: string;
  /** Shipping cost */
  cost: number;
  /** Tax on shipping */
  tax?: number;
  /** Tracking number */
  trackingNumber?: string;
  /** Tracking URL */
  trackingUrl?: string;
  /** Estimated delivery date */
  estimatedDeliveryDate?: string | Date;
  /** Actual delivery date */
  deliveredAt?: string | Date;
  /** Shipping label URL */
  labelUrl?: string;
  /** Package dimensions */
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  /** Package weight */
  weight?: {
    value: number;
    unit: string;
  };
  /** Whether the order contains digital items only */
  isDigitalOnly: boolean;
}

/**
 * Interface for order payment information
 */
export interface OrderPayment {
  /** Payment method */
  method: PaymentMethod;
  /** Payment status */
  status: PaymentStatus;
  /** Transaction ID from payment processor */
  transactionId?: string;
  /** Last 4 digits of credit card (if applicable) */
  cardLast4?: string;
  /** Card brand (if applicable) */
  cardBrand?: string;
  /** Payment amount */
  amount: number;
  /** Currency code */
  currency: string;
  /** Payment date */
  paidAt?: string | Date;
  /** Payment gateway used */
  gateway?: string;
  /** Payment receipt URL */
  receiptUrl?: string;
  /** Whether this payment is refundable */
  isRefundable?: boolean;
  /** Refund information */
  refunds?: Array<{
    id: string | number;
    amount: number;
    reason?: string;
    date: string | Date;
    transactionId?: string;
  }>;
  /** Payment metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for order totals
 */
export interface OrderTotals {
  /** Subtotal (before discounts and taxes) */
  subtotal: number;
  /** Discount total */
  discountTotal: number;
  /** Tax total */
  taxTotal: number;
  /** Shipping total */
  shippingTotal: number;
  /** Final order total */
  total: number;
  /** Amount paid */
  paidAmount: number;
  /** Amount due */
  dueAmount: number;
  /** Currency code */
  currency: string;
}

/**
 * Interface for order notes
 */
export interface OrderNote {
  /** Unique identifier for the note */
  id: string | number;
  /** Order ID this note belongs to */
  orderId: string | number;
  /** User ID who created the note */
  userId?: string | number;
  /** User name who created the note */
  userName?: string;
  /** Note content */
  content: string;
  /** Whether this note is visible to customers */
  isCustomerVisible: boolean;
  /** Creation timestamp */
  createdAt: string | Date;
}

/**
 * Interface for order history entry
 */
export interface OrderHistoryEntry {
  /** Unique identifier for the history entry */
  id: string | number;
  /** Order ID this history belongs to */
  orderId: string | number;
  /** User ID who made the change */
  userId?: string | number;
  /** User name who made the change */
  userName?: string;
  /** Previous status */
  previousStatus?: OrderStatus;
  /** New status */
  newStatus?: OrderStatus;
  /** Entry description */
  description: string;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for an order
 */
export interface Order {
  /** Unique identifier for the order */
  id: string | number;
  /** Order number (customer-facing ID) */
  orderNumber: string;
  /** User ID who placed the order */
  userId?: string | number;
  /** User email */
  userEmail: string;
  /** Order status */
  status: OrderStatus;
  /** Order items */
  items: OrderItem[];
  /** Billing address */
  billingAddress: Address;
  /** Shipping information */
  shipping: OrderShipping;
  /** Payment information */
  payment: OrderPayment;
  /** Order totals */
  totals: OrderTotals;
  /** Customer notes */
  customerNote?: string;
  /** Internal notes */
  internalNotes?: OrderNote[];
  /** Order history */
  history?: OrderHistoryEntry[];
  /** Applied discounts */
  discounts?: DiscountInfo[];
  /** Applied taxes */
  taxes?: TaxInfo[];
  /** IP address used to place the order */
  ipAddress?: string;
  /** User agent used to place the order */
  userAgent?: string;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last update timestamp */
  updatedAt: string | Date;
  /** Digital delivery information */
  digitalDelivery?: {
    downloadLinks?: string[];
    accessCodes?: string[];
    expiresAt?: string | Date;
  };
  /** Fulfillment status */
  fulfillmentStatus?: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled';
  /** Order metadata */
  metadata?: Record<string, any>;
}
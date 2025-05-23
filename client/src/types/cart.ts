import { Product, ProductVariant } from './product';
import { Address } from './order';

/**
 * Interface for cart item
 */
export interface CartItem {
  /** Unique identifier for the cart item */
  id: string | number;
  /** Product ID */
  productId: string | number;
  /** Product information */
  product: Partial<Product>;
  /** Product variant ID */
  variantId?: string | number;
  /** Product variant information */
  variant?: Partial<ProductVariant>;
  /** Quantity */
  quantity: number;
  /** Unit price */
  unitPrice: number;
  /** Subtotal (unit price × quantity) */
  subtotal: number;
  /** Total discounts applied to this item */
  discountTotal: number;
  /** Final total for this item */
  total: number;
  /** Item options (color, size, etc.) */
  options?: Record<string, string>;
  /** Product SKU */
  sku: string;
  /** Whether the item is a digital product */
  isDigital: boolean;
  /** Whether the item requires shipping */
  requiresShipping: boolean;
  /** Item weight for shipping */
  weight?: number;
  /** Whether the item is tax exempt */
  isTaxExempt: boolean;
  /** Gift wrapping */
  giftWrapping?: {
    /** Whether gift wrapping is enabled */
    enabled: boolean;
    /** Gift wrapping message */
    message?: string;
    /** Gift wrapping cost */
    cost?: number;
  };
  /** Added to cart timestamp */
  addedAt: string | Date;
  /** Last updated timestamp */
  updatedAt: string | Date;
  /** item metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for cart totals
 */
export interface CartTotals {
  /** Subtotal (before discounts and taxes) */
  subtotal: number;
  /** Discount total */
  discountTotal: number;
  /** Tax total */
  taxTotal: number;
  /** Shipping total */
  shippingTotal: number;
  /** Final cart total */
  total: number;
  /** Currency code */
  currency: string;
}

/**
 * Interface for cart coupon
 */
export interface CartCoupon {
  /** Coupon code */
  code: string;
  /** Coupon type */
  type: 'percentage' | 'fixed' | 'free_shipping';
  /** Coupon value */
  value: number;
  /** Discount amount */
  discountAmount: number;
  /** Coupon description */
  description?: string;
  /** Applied timestamp */
  appliedAt: string | Date;
}

/**
 * Interface for shipping options
 */
export interface ShippingOption {
  /** Unique identifier for the shipping option */
  id: string | number;
  /** Shipping method name */
  name: string;
  /** Shipping carrier */
  carrier?: string;
  /** Shipping cost */
  cost: number;
  /** Estimated delivery time */
  estimatedDelivery?: string;
  /** Whether this is the default option */
  isDefault: boolean;
  /** Shipping metadata */
  metadata?: Record<string, any>;
}

/**
 * Interface for cart
 */
export interface Cart {
  /** Unique identifier for the cart */
  id: string | number;
  /** User ID (if user is logged in) */
  userId?: string | number;
  /** Guest ID (if user is not logged in) */
  guestId?: string;
  /** Cart items */
  items: CartItem[];
  /** Cart totals */
  totals: CartTotals;
  /** Applied coupons */
  coupons: CartCoupon[];
  /** Billing address */
  billingAddress?: Address;
  /** Shipping address */
  shippingAddress?: Address;
  /** Whether billing and shipping addresses are the same */
  sameAddress?: boolean;
  /** Selected shipping method */
  selectedShipping?: ShippingOption;
  /** Available shipping options */
  shippingOptions?: ShippingOption[];
  /** Customer note */
  note?: string;
  /** Creation timestamp */
  createdAt: string | Date;
  /** Last update timestamp */
  updatedAt: string | Date;
  /** Expiration timestamp */
  expiresAt?: string | Date;
  /** Whether the cart contains digital items only */
  isDigitalOnly: boolean;
  /** Whether the cart has been converted to an order */
  convertedToOrder: boolean;
  /** The ID of the order created from this cart */
  orderId?: string | number;
  /** Cart metadata */
  metadata?: Record<string, any>;
}
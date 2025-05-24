import { Cart, CartItem, CartTotals, Address, ShippingOption } from './cart';

/**
 * Enum for checkout steps
 */
export enum CheckoutStep {
  ADDRESS = 'address',
  DELIVERY = 'delivery',
  PAYMENT = 'payment',
  OTP_VERIFICATION = 'otp_verification',
  SUMMARY = 'summary',
  CONFIRMATION = 'confirmation',
}

/**
 * Enum for payment methods
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  UPI = 'upi',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer',
  COD = 'cod',
}

/**
 * Enum for order status
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

/**
 * Enum for payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

/**
 * Interface for delivery time slot
 */
export interface DeliveryTimeSlot {
  /** Unique identifier for the delivery slot */
  id: string;
  /** Date (YYYY-MM-DD format) */
  date: string;
  /** Start time (HH:MM format) */
  startTime: string;
  /** End time (HH:MM format) */
  endTime: string;
  /** Delivery fee (if any) */
  fee?: number;
  /** Whether the slot is available */
  available: boolean;
}

/**
 * Interface for credit card payment details
 */
export interface CardDetails {
  /** Card number */
  cardNumber: string;
  /** Name on card */
  nameOnCard: string;
  /** Expiry month (MM format) */
  expiryMonth: string;
  /** Expiry year (YYYY format) */
  expiryYear: string;
  /** CVV */
  cvv: string;
  /** Whether to save for later */
  saveForLater?: boolean;
  /** Saved method ID (if using a saved method) */
  savedMethodId?: string;
}

/**
 * Interface for UPI payment details
 */
export interface UPIDetails {
  /** UPI ID */
  upiId: string;
  /** UPI provider */
  provider?: string;
}

/**
 * Interface for wallet payment details
 */
export interface WalletDetails {
  /** Wallet provider */
  provider: string;
  /** Mobile number */
  mobileNumber: string;
}

/**
 * Interface for bank transfer details
 */
export interface BankTransferDetails {
  /** Bank account number */
  accountNumber: string;
  /** Bank name */
  bankName: string;
  /** IFSC code */
  ifscCode: string;
}

/**
 * Interface for payment details
 */
export interface PaymentDetails {
  /** Payment method */
  method: PaymentMethod;
  /** Payment details (card, UPI, etc.) */
  details?: CardDetails | UPIDetails | WalletDetails | BankTransferDetails;
}

/**
 * Interface for saved payment method
 */
export interface SavedPaymentMethod {
  /** Unique identifier for the payment method */
  id: string;
  /** User ID */
  userId: string | number;
  /** Payment method type */
  type: PaymentMethod;
  /** Card details (if card) */
  cardBrand?: string;
  /** Masked card number (if card) */
  maskedNumber?: string;
  /** Card expiry (if card) */
  cardExpiry?: string;
  /** UPI ID (if UPI) */
  upiId?: string;
  /** Wallet provider (if wallet) */
  walletProvider?: string;
  /** Last used timestamp */
  lastUsed?: string;
  /** Is default payment method */
  isDefault?: boolean;
}

/**
 * Interface for OTP verification
 */
export interface OTPVerification {
  /** Phone number to which OTP is sent */
  phoneNumber: string;
  /** Email to which OTP is sent (optional) */
  email?: string;
  /** Request ID to track OTP verification */
  requestId: string;
  /** OTP code */
  otp: string;
  /** Expiry timestamp */
  expiresAt: string;
  /** Number of attempts */
  attempts: number;
  /** Maximum allowed attempts */
  maxAttempts: number;
  /** Whether OTP is verified */
  isVerified: boolean;
}

/**
 * Interface for transaction
 */
export interface Transaction {
  /** Transaction ID */
  id: string;
  /** Payment method */
  paymentMethod: PaymentMethod;
  /** Payment status */
  status: PaymentStatus;
  /** Transaction amount */
  amount: number;
  /** Currency */
  currency: string;
  /** Transaction timestamp */
  timestamp: string;
  /** Processor ID (e.g., Stripe, PayPal) */
  processorId: string;
  /** Processor response */
  processorResponse: string;
}

/**
 * Interface for order
 */
export interface Order {
  /** Unique identifier for the order */
  id: string;
  /** User ID (if user is logged in) */
  userId?: string | number;
  /** Guest ID (if user is not logged in) */
  guestId?: string;
  /** Order status */
  status: OrderStatus;
  /** Order items */
  items: CartItem[];
  /** Order totals */
  totals: CartTotals;
  /** Billing address */
  billingAddress: Address;
  /** Shipping address */
  shippingAddress: Address;
  /** Selected shipping method */
  shippingMethod: ShippingOption;
  /** Delivery slot */
  deliverySlot?: DeliveryTimeSlot;
  /** Payment method */
  paymentMethod: PaymentMethod;
  /** Tracking number */
  trackingNumber?: string;
  /** Tracking URL */
  trackingUrl?: string;
  /** Order placed timestamp */
  placedAt: string;
  /** Order updated timestamp */
  updatedAt: string;
  /** Estimated delivery date */
  estimatedDelivery?: string;
  /** Transaction information */
  transaction?: Transaction;
  /** Customer notes */
  notes?: string;
  /** Order metadata */
  metadata?: Record<string, any>;
}
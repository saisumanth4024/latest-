import { Address, Cart, CartTotals, ShippingOption } from './cart';
import { UserProfile } from './index';

/**
 * Available payment methods
 */
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  COD = 'cod',
  WALLET = 'wallet',
  BANK_TRANSFER = 'bank_transfer'
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

/**
 * Order status types
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
 * Delivery time slot
 */
export interface DeliveryTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  fee?: number;
}

/**
 * Card details for payment
 */
export interface CardDetails {
  cardNumber: string;
  nameOnCard: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveForLater?: boolean;
}

/**
 * UPI details for payment
 */
export interface UPIDetails {
  upiId: string;
  provider?: string;
}

/**
 * Bank transfer details
 */
export interface BankTransferDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

/**
 * Wallet details
 */
export interface WalletDetails {
  provider: string;
  mobileNumber?: string;
  email?: string;
}

/**
 * Payment details - union type based on method
 */
export type PaymentDetails = 
  | { method: PaymentMethod.CREDIT_CARD | PaymentMethod.DEBIT_CARD; details: CardDetails }
  | { method: PaymentMethod.UPI; details: UPIDetails }
  | { method: PaymentMethod.COD; details?: never }
  | { method: PaymentMethod.WALLET; details: WalletDetails }
  | { method: PaymentMethod.BANK_TRANSFER; details: BankTransferDetails };

/**
 * Saved payment method
 */
export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethod;
  isDefault: boolean;
  lastUsed?: string;
  nickname?: string;
  
  // Masked details
  maskedNumber?: string;
  cardBrand?: string;
  cardExpiry?: string;
  upiId?: string;
  walletProvider?: string;
}

/**
 * Checkout steps
 */
export enum CheckoutStep {
  ADDRESS = 'address',
  DELIVERY = 'delivery',
  PAYMENT = 'payment',
  SUMMARY = 'summary',
  CONFIRMATION = 'confirmation',
  OTP_VERIFICATION = 'otp_verification'
}

/**
 * OTP verification
 */
export interface OTPVerification {
  phoneNumber: string;
  email?: string;
  requestId: string;
  otp: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  isVerified: boolean;
}

/**
 * Transaction details
 */
export interface TransactionDetails {
  id: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  fee?: number;
  processorId?: string;
  processorResponse?: string;
  timestamp: string;
}

/**
 * Order interface
 */
export interface Order {
  id: string;
  userId?: string | number;
  status: OrderStatus;
  items: Array<any>; // Cart items
  totals: CartTotals;
  billingAddress: Address;
  shippingAddress: Address;
  shippingMethod: ShippingOption;
  paymentMethod: PaymentMethod;
  transaction?: TransactionDetails;
  placedAt: string;
  estimatedDelivery?: string;
  deliverySlot?: DeliveryTimeSlot;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Checkout state
 */
export interface CheckoutState {
  activeStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  billingAddress?: Address;
  shippingAddress?: Address;
  sameAddress: boolean;
  selectedDeliverySlot?: DeliveryTimeSlot;
  availableDeliverySlots: DeliveryTimeSlot[];
  selectedPaymentMethod?: PaymentMethod;
  paymentDetails?: PaymentDetails;
  savedPaymentMethods: SavedPaymentMethod[];
  orderTotal: number;
  otpVerification?: OTPVerification;
  order?: Order;
  error?: string;
  processingPayment: boolean;
  placingOrder: boolean;
}
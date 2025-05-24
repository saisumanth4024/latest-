import { OrderStatus, PaymentMethod } from './checkout';
export { OrderStatus };
import { Product } from './product';
import { Address } from './cart';

export enum OrderTrackingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELED = 'canceled',
}

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

export enum ReturnReason {
  DAMAGED = 'damaged',
  DEFECTIVE = 'defective',
  WRONG_ITEM = 'wrong_item',
  NOT_AS_DESCRIBED = 'not_as_described',
  CHANGED_MIND = 'changed_mind',
  SIZE_FIT_ISSUE = 'size_fit_issue',
  QUALITY_ISSUE = 'quality_issue',
  LATE_DELIVERY = 'late_delivery',
  OTHER = 'other',
}

export enum CancellationReason {
  FOUND_BETTER_PRICE = 'found_better_price',
  CHANGED_MIND = 'changed_mind',
  PURCHASED_BY_MISTAKE = 'purchased_by_mistake',
  SHIPPING_TAKING_TOO_LONG = 'shipping_taking_too_long',
  DELIVERY_DATE_TOO_LATE = 'delivery_date_too_late',
  ORDER_CREATED_BY_MISTAKE = 'order_created_by_mistake',
  ITEM_NOT_NEEDED_ANYMORE = 'item_not_needed_anymore',
  OTHER = 'other',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  options?: Record<string, string>;
  status: OrderStatus;
  returnStatus?: ReturnStatus;
  returnReason?: ReturnReason;
  returnDate?: string;
  returnNotes?: string;
  returnApprovedAt?: string;
  returnRejectionReason?: string;
  refundAmount?: number;
  refundDate?: string;
  refundTransactionId?: string;
}

export interface OrderTracking {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: OrderTrackingStatus;
  estimatedDelivery?: string;
  actualDelivery?: string;
  updates: OrderTrackingUpdate[];
}

export interface OrderTrackingUpdate {
  id: string;
  trackingId: string;
  status: OrderTrackingStatus;
  location?: string;
  timestamp: string;
  description: string;
}

export interface OrderInvoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceUrl: string;
  dueDate?: string;
  paidDate?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface OrderRating {
  id: string;
  orderId: string;
  rating: number; // 1-5
  review?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  updatedAt: string;
  items: OrderItem[];
  shipping: {
    address: Address;
    method: string;
    cost: number;
    estimatedDelivery?: string;
  };
  billing: {
    address: Address;
    paymentMethod: PaymentMethod;
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  tracking?: OrderTracking;
  invoice?: OrderInvoice;
  rating?: OrderRating;
  notes?: string;
  cancellationReason?: CancellationReason;
  cancellationDate?: string;
  cancellationNotes?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId: string;
  reason: ReturnReason;
  description?: string;
  requestedAt: string;
  status: ReturnStatus;
  processedAt?: string;
  processorId?: string;
  rejectionReason?: string;
  refundAmount?: number;
  refundMethod?: PaymentMethod;
  refundTransactionId?: string;
  refundProcessedAt?: string;
  images?: string[];
}

export interface CancellationRequest {
  id: string;
  orderId: string;
  reason: CancellationReason;
  description?: string;
  requestedAt: string;
  status: OrderStatus; // Using OrderStatus.CANCELED or other status
  processedAt?: string;
  processorId?: string;
  rejectionReason?: string;
  refundAmount?: number;
  refundMethod?: PaymentMethod;
  refundTransactionId?: string;
  refundProcessedAt?: string;
}

// Order Request Payload Types
export interface RequestReturnPayload {
  orderId: string;
  orderItemId: string;
  reason: ReturnReason;
  description?: string;
  images?: string[];
}

export interface RequestCancellationPayload {
  orderId: string;
  reason: CancellationReason;
  description?: string;
}

// RTK Query response types
export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderDetailsResponse {
  order: Order;
  tracking?: OrderTracking;
  invoice?: OrderInvoice;
  returnRequests?: ReturnRequest[];
  cancellationRequest?: CancellationRequest;
}

export interface OrderTrackingResponse {
  tracking: OrderTracking;
}

export interface ReturnRequestResponse {
  returnRequest: ReturnRequest;
}

export interface CancellationRequestResponse {
  cancellationRequest: CancellationRequest;
}

export interface InvoiceResponse {
  invoice: OrderInvoice;
}

// Query parameters
export interface OrdersQueryParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'placedAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}
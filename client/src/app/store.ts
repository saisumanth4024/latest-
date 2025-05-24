import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/features/products/productsSlice';
import { productsApi } from '@/features/products/productsApi';
import cartReducer from '@/features/cart/cartSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';
import checkoutReducer from '@/features/checkout/checkoutSlice';
import ordersReducer from '@/features/orders/ordersSlice';
import { ordersApi } from '@/features/orders/ordersApi';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    checkout: checkoutReducer,
    orders: ordersReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'cart/addToCart/fulfilled', 
          'wishlist/addToWishlist/fulfilled',
          'checkout/processPayment/fulfilled',
          'checkout/placeOrder/fulfilled',
          'checkout/requestOTP/fulfilled',
          'orders/submitReturnRequest/fulfilled',
          'orders/submitCancellationRequest/fulfilled'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.createdAt', 
          'payload.updatedAt', 
          'payload.addedAt',
          'payload.timestamp',
          'payload.expiresAt',
          'payload.placedAt',
          'payload.estimatedDelivery',
          'payload.requestedAt',
          'payload.processedAt',
          'payload.refundProcessedAt',
          'payload.returnDate',
          'payload.returnApprovedAt',
          'payload.cancellationDate',
          'payload.actualDelivery',
          'payload.invoiceDate',
          'payload.dueDate',
          'payload.paidDate'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'cart.cart.createdAt', 
          'cart.cart.updatedAt', 
          'cart.cart.items.addedAt',
          'cart.cart.items.updatedAt',
          'wishlist.wishlists.createdAt',
          'wishlist.wishlists.updatedAt',
          'wishlist.wishlists.items.addedAt',
          'checkout.order.placedAt',
          'checkout.order.estimatedDelivery',
          'checkout.order.transaction.timestamp',
          'checkout.otpVerification.expiresAt',
          'checkout.savedPaymentMethods.lastUsed',
          'orders.orders.entities.*.placedAt',
          'orders.orders.entities.*.updatedAt',
          'orders.orders.entities.*.estimatedDelivery',
          'orders.orderTracking.entities.*.estimatedDelivery',
          'orders.orderTracking.entities.*.actualDelivery',
          'orders.orderTracking.entities.*.updates.*.timestamp',
          'orders.returnRequests.entities.*.requestedAt',
          'orders.returnRequests.entities.*.processedAt',
          'orders.returnRequests.entities.*.returnDate',
          'orders.returnRequests.entities.*.refundProcessedAt',
          'orders.cancellationRequests.entities.*.requestedAt',
          'orders.cancellationRequests.entities.*.processedAt',
          'orders.cancellationRequests.entities.*.refundProcessedAt'
        ],
      },
    }).concat(productsApi.middleware, ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
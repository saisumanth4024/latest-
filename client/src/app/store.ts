import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/features/products/productsSlice';
import { productsApi } from '@/features/products/productsApi';
import cartReducer from '@/features/cart/cartSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['cart/addToCart/fulfilled', 'wishlist/addToWishlist/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt', 'payload.addedAt'],
        // Ignore these paths in the state
        ignoredPaths: [
          'cart.cart.createdAt', 
          'cart.cart.updatedAt', 
          'cart.cart.items.addedAt',
          'cart.cart.items.updatedAt',
          'wishlist.wishlists.createdAt',
          'wishlist.wishlists.updatedAt',
          'wishlist.wishlists.items.addedAt'
        ],
      },
    }).concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
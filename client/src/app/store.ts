import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '@/features/api/apiSlice';
import { productsApi } from '@/features/products/productsApi';
import authReducer from '@/features/auth/authSlice';
import toastReducer from '@/features/ui/toastSlice';
import modalReducer from '@/features/ui/modalSlice';
import profileReducer from '@/features/profile/profileSlice';
import productsReducer from '@/features/products/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    modal: modalReducer,
    profile: profileReducer,
    products: productsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(productsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

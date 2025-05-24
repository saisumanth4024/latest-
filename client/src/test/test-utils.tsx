import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Router } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { vi } from 'vitest';

// Import reducers
import authReducer from '@/features/auth/authSlice';
import productsReducer from '@/features/products/productsSlice';
import cartReducer from '@/features/cart/cartSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';
import checkoutReducer from '@/features/checkout/checkoutSlice';
import ordersReducer from '@/features/orders/ordersSlice';
import dashboardReducer from '@/features/dashboard/dashboardSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import contentReducer from '@/features/content/contentSlice';
import reviewsReducer from '@/features/reviews/reviewsSlice';
import searchReducer from '@/features/search/searchSlice';
import adminReducer from '@/features/admin/adminSlice';
import navigationReducer from '@/features/navigation/navigationSlice';

// Mock store setup
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      checkout: checkoutReducer,
      orders: ordersReducer,
      dashboard: dashboardReducer,
      notifications: notificationsReducer,
      content: contentReducer,
      reviews: reviewsReducer,
      search: searchReducer,
      admin: adminReducer,
      navigation: navigationReducer,
    },
    preloadedState,
  });
}

// Create a location hook for testing
const createMockLocationHook = (currentLocation = '/') => {
  return () => {
    return [currentLocation, vi.fn()] as [string, (path: string, ...args: any[]) => any];
  };
};

// Setup providers for testing
interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Record<string, any>;
  route?: string;
  store?: ReturnType<typeof createTestStore>;
}

// Create a custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    route = '/',
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router hook={createMockLocationHook(route)}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from RTL
export * from '@testing-library/react';
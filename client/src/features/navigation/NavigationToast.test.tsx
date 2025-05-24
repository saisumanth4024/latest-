import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavigationToast from './NavigationToast';
import { renderWithProviders } from '@/test/test-utils';
import { navigateTo } from './navigationSlice';
import * as hooks from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  }))
}));

describe('NavigationToast Component', () => {
  const mockToast = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup toast mock for each test
    vi.mocked(hooks.useToast).mockImplementation(() => ({
      toast: mockToast
    }));
  });

  it('should not show toast notification on initial render', () => {
    // Render with initial route
    renderWithProviders(<NavigationToast />, { 
      route: '/',
      preloadedState: {
        navigation: {
          previousPath: null,
          currentPath: null, // Important! currentPath is null initially
          navigationHistory: [],
          lastTransitionTime: null,
        }
      }
    });
    
    // No toast should be shown on initial render
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('should show toast notification when navigating to a new route', () => {
    // First, set up the initial state with currentPath already set to '/'
    const { store } = renderWithProviders(<NavigationToast />, {
      route: '/',
      preloadedState: {
        navigation: {
          previousPath: null,
          currentPath: '/', // Initial path is set
          navigationHistory: ['/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // No toast on initial render since currentPath === location
    expect(mockToast).not.toHaveBeenCalled();
    
    // Now simulate navigation by:
    // 1. Changing the route
    // 2. Re-rendering component
    store.dispatch(navigateTo('/products'));
    
    // Re-render with new route
    renderWithProviders(<NavigationToast />, {
      route: '/products',
      store
    });
    
    // Toast should have been called once
    expect(mockToast).toHaveBeenCalledTimes(1);
    
    // Toast should include the new route name
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Products'),
        description: expect.stringContaining('Products'),
        duration: 3000,
        variant: "default",
      })
    );
  });

  it('should identify route names from dynamic routes', () => {
    // Setup initial state with currentPath
    const { store } = renderWithProviders(<NavigationToast />, {
      route: '/products',
      preloadedState: {
        navigation: {
          previousPath: '/',
          currentPath: '/products',
          navigationHistory: ['/products', '/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // Reset mock to ensure clean test
    mockToast.mockReset();
    
    // Navigate to a dynamic route
    store.dispatch(navigateTo('/products/123'));
    
    // Re-render with new dynamic route
    renderWithProviders(<NavigationToast />, {
      route: '/products/123',
      store
    });
    
    // Toast should be called with correct product details title
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Product Details'),
        description: expect.stringContaining('Product Details'),
      })
    );
  });

  it('should handle unknown routes gracefully', () => {
    // Setup initial state with currentPath
    const { store } = renderWithProviders(<NavigationToast />, {
      route: '/known-route',
      preloadedState: {
        navigation: {
          previousPath: '/',
          currentPath: '/known-route',
          navigationHistory: ['/known-route', '/'],
          lastTransitionTime: Date.now(),
        }
      }
    });
    
    // Reset mock to ensure clean test
    mockToast.mockReset();
    
    // Navigate to an unknown route
    store.dispatch(navigateTo('/some-unknown-route'));
    
    // Re-render with unknown route
    renderWithProviders(<NavigationToast />, {
      route: '/some-unknown-route',
      store
    });
    
    // Toast should be called with a default "Unknown Page" name
    expect(mockToast).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Unknown Page'),
        description: expect.stringContaining('Unknown Page'),
      })
    );
  });
});
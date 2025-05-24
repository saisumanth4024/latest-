import React, { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * Custom loading component for lazy-loaded components
 */
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8 min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * Generic error component for lazy-loaded components
 */
const DefaultErrorComponent = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
    <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
      Failed to load component
    </h3>
    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
      {error.message || 'An unexpected error occurred while loading this component.'}
    </p>
    <button
      onClick={reset}
      className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
    >
      Try Again
    </button>
  </div>
);

/**
 * Options for lazy loading components
 */
interface LazyLoadOptions {
  fallback?: React.ReactNode;
  errorComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  minDelay?: number; // Minimum delay in ms to show loading indicator
}

/**
 * Wraps a dynamic import with Suspense and ErrorBoundary
 * @param factory - Function that returns a dynamic import
 * @param options - Configuration options
 * @returns Lazy-loaded component wrapped with Suspense and ErrorBoundary
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const {
    fallback = <DefaultFallback />,
    errorComponent = DefaultErrorComponent,
    minDelay = 0
  } = options;

  // Create lazy component with minimum delay if specified
  const LazyComponent = lazy(() => {
    if (minDelay <= 0) return factory();
    
    // Add artificial delay to avoid flash of loading state for fast networks
    return Promise.all([
      factory(),
      new Promise(resolve => setTimeout(resolve, minDelay))
    ]).then(([moduleExport]) => moduleExport);
  });

  // Return wrapped component
  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary errorComponent={errorComponent}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Creates a lazy-loaded component with a predefined loading state
 * @param importFunc - Function that returns a dynamic import
 * @returns Lazy-loaded component
 */
export const LazyComponent = <T extends ComponentType<any>>(importFunc: () => Promise<{ default: T }>) => {
  return lazyLoad(importFunc);
};

export default LazyComponent;
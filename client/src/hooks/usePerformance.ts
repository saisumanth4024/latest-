import { 
  useState, 
  useCallback, 
  useDeferredValue as useReactDeferredValue,
  useTransition as useReactTransition, 
  useRef,
  useEffect
} from 'react';

/**
 * Enhanced version of React's useDeferredValue with additional options
 * @param value - The value to defer
 * @param options - Configuration options
 * @returns The deferred value and status information
 */
export function useDeferredValue<T>(
  value: T, 
  options: { timeout?: number; trackChanges?: boolean } = {}
) {
  const { timeout, trackChanges = false } = options;
  const deferredValue = useReactDeferredValue(value);
  const [isPending, setIsPending] = useState(false);
  const previousValueRef = useRef(value);
  
  useEffect(() => {
    // Detect if the value has changed
    if (trackChanges && value !== previousValueRef.current) {
      setIsPending(true);
      
      // Set a timer to match the expected deferral time
      const timer = setTimeout(() => {
        setIsPending(false);
        previousValueRef.current = value;
      }, timeout || 200); // Default timeout of 200ms
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [value, timeout, trackChanges]);
  
  return { 
    deferredValue, 
    isPending, 
    isStale: deferredValue !== value 
  };
}

/**
 * Enhanced version of React's useTransition with additional features
 * @param options - Configuration options
 * @returns Transition state and functions
 */
export function useTransition(options: { timeoutMs?: number } = {}) {
  const [isPending, startTransition] = useReactTransition();
  const [error, setError] = useState<Error | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  // Enhanced startTransition that supports async operations and error handling
  const startTransitionEnhanced = useCallback((callback: () => void) => {
    setError(null);
    setIsComplete(false);
    
    // First use the standard startTransition
    startTransition(() => {
      try {
        // Execute the callback
        callback();
        setIsComplete(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsComplete(true);
      }
    });
  }, [startTransition]);
  
  return { 
    isPending, 
    startTransition: startTransitionEnhanced, 
    error,
    isComplete,
    reset: useCallback(() => {
      setError(null);
      setIsComplete(false);
    }, []) 
  };
}

/**
 * Hook to detect when a component is rendering too frequently
 * @param componentName - Name of the component for identification
 * @param threshold - Number of renders within timeWindow to trigger warning
 * @param timeWindow - Time window in ms to count renders
 */
export function useRenderWarning(
  componentName: string,
  threshold = 5,
  timeWindow = 1000
) {
  const renderCountRef = useRef(0);
  const lastWarningTimeRef = useRef(0);
  
  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    
    // Check if we should log a warning
    if (
      renderCountRef.current >= threshold &&
      now - lastWarningTimeRef.current > timeWindow
    ) {
      console.warn(
        `[Performance Warning] Component "${componentName}" rendered ${renderCountRef.current} times within ${timeWindow}ms. Consider optimizing with memo, useMemo, or useCallback.`
      );
      
      lastWarningTimeRef.current = now;
      renderCountRef.current = 0;
    }
    
    // Reset counter after the time window
    const timerId = setTimeout(() => {
      renderCountRef.current = 0;
    }, timeWindow);
    
    return () => clearTimeout(timerId);
  });
}

/**
 * Creates a throttled version of a function
 * @param fn - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200
) {
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);
  
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastExecuted.current;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Store the latest arguments
      argsRef.current = args;
      
      // If enough time has elapsed, execute immediately
      if (elapsed >= delay) {
        lastExecuted.current = now;
        return fn(...args);
      }
      
      // Otherwise, schedule execution
      timeoutRef.current = setTimeout(() => {
        if (argsRef.current) {
          lastExecuted.current = Date.now();
          fn(...argsRef.current);
        }
        timeoutRef.current = null;
      }, delay - elapsed);
      
      return undefined;
    },
    [fn, delay]
  );
}

export default {
  useDeferredValue,
  useTransition,
  useRenderWarning,
  useThrottle
};
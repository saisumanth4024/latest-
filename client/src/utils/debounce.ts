/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - Whether to invoke the function on the leading edge of the timeout
 * @returns A debounced function
 * 
 * @example
 * ```typescript
 * // Debounce a search function to be called 300ms after the user stops typing
 * const debouncedSearch = debounce((searchTerm: string) => {
 *   console.log(`Searching for: ${searchTerm}`);
 *   // API call here
 * }, 300);
 * 
 * // Call this on input change
 * debouncedSearch('search term');
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

export default debounce;
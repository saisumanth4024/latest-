/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - The options object
 * @param options.leading - Specify invoking on the leading edge of the timeout
 * @param options.trailing - Specify invoking on the trailing edge of the timeout
 * @returns A throttled function
 * 
 * @example
 * ```typescript
 * // Throttle a scroll event handler to execute at most once every 100ms
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handler called');
 *   // Logic here
 * }, 100);
 * 
 * // Add event listener
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait = 100,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  let result: ReturnType<T>;
  const { leading = true, trailing = true } = options;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    
    if (!previous && !leading) {
      previous = now;
    }
    
    const remaining = wait - (now - previous);
    
    const context = this;
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        result = func.apply(context, args);
      }, remaining);
    }
  };
}

export default throttle;
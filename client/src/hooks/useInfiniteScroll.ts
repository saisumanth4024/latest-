import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** Distance from bottom of page to trigger next page (in pixels) */
  threshold?: number;
  /** Initial page number */
  initialPage?: number;
  /** Whether to start loading automatically */
  autoLoad?: boolean;
  /** Whether to reset when dependencies change */
  resetOnDepsChange?: boolean;
  /** Callback to load more items */
  onLoadMore: (page: number) => Promise<boolean>;
}

/**
 * Custom hook for implementing infinite scrolling
 */
export function useInfiniteScroll({
  threshold = 200,
  initialPage = 1,
  autoLoad = true,
  resetOnDepsChange = false,
  onLoadMore
}: UseInfiniteScrollOptions) {
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      
      // Disconnect previous observer
      if (observer.current) {
        observer.current.disconnect();
      }
      
      // Skip if no more items
      if (!hasMore) return;
      
      // Create new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: `0px 0px ${threshold}px 0px`,
          threshold: 0.1,
        }
      );
      
      // Observe new node
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, threshold]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const hasMoreItems = await onLoadMore(page);
      setHasMore(hasMoreItems);
      
      if (hasMoreItems) {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, onLoadMore, page]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLoading(false);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  // Load first page automatically if autoLoad is true
  useEffect(() => {
    if (autoLoad && hasMore && page === initialPage) {
      loadMore();
    }
  }, [autoLoad, hasMore, loadMore, page, initialPage]);

  // Reset when dependencies change if resetOnDepsChange is true
  useEffect(() => {
    if (resetOnDepsChange) {
      reset();
    }
  }, [onLoadMore, resetOnDepsChange, reset]);

  return {
    page,
    loading,
    hasMore,
    error,
    lastElementRef,
    loadMore,
    reset,
  };
}

export default useInfiniteScroll;
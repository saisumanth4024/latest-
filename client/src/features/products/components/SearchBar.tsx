import React, { useState, useCallback, useMemo, useDeferredValue, useTransition } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useThrottle } from '@/hooks/usePerformance';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Enhanced SearchBar component with performance optimizations:
 * - Uses React.memo to prevent unnecessary re-renders
 * - Implements useDeferredValue for smoother typing experience
 * - Uses useTransition for non-blocking UI updates
 * - Throttles search callbacks to reduce API calls
 * - Wrapped in ErrorBoundary for resilience
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = '',
  placeholder = 'Search products...',
  className = '',
  autoFocus = false
}) => {
  // State for the search input
  const [query, setQuery] = useState(initialQuery);
  
  // Use deferred value to prevent UI blocking during typing
  const deferredQuery = useDeferredValue(query);
  
  // Add transition state for search operations
  const [isPending, startTransition] = useTransition();
  
  // Throttle the search callback to prevent excessive API calls
  const throttledSearch = useThrottle((searchQuery: string) => {
    onSearch(searchQuery);
  }, 400);
  
  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Use transition to keep UI responsive during search
    startTransition(() => {
      throttledSearch(newQuery);
    });
  }, [throttledSearch]);
  
  // Handle clearing the search input
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);
  
  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }, [onSearch, query]);
  
  // Determine if input has content to show clear button
  const showClearButton = useMemo(() => query.length > 0, [query]);
  
  // Show visual indication when search is optimized with useDeferredValue
  const isStale = query !== deferredQuery;
  
  return (
    <ErrorBoundary>
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center ${className}`}
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {isPending || isStale ? (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-gray-400" />
            )}
          </div>
          
          <Input
            type="search"
            value={query}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 border-gray-300 focus:border-primary focus:ring-primary rounded-md ${isStale ? 'bg-gray-50' : ''}`}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-label="Search"
          />
          
          {showClearButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={handleClear}
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>
        
        <Button 
          type="submit"
          variant="default"
          className="ml-2"
        >
          Search
        </Button>
      </form>
    </ErrorBoundary>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(SearchBar);
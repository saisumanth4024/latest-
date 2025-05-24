import React, { useState, useCallback, useMemo, useTransition, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  Filter, 
  SearchParams 
} from '../types/advancedTypes';

/**
 * Props for the GenericSearchBar component
 * T is a generic type parameter for the entity being searched
 */
interface GenericSearchBarProps<T extends object> {
  /** Callback function for when the search query changes */
  onSearch: (params: SearchParams<T>) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional initial search query */
  initialQuery?: string;
  /** Optional debounce time in milliseconds */
  debounceTime?: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional filters to apply to the search */
  filters?: Filter<T>[];
  /** Optional callback for when the search is cleared */
  onClear?: () => void;
  /** Optional search button label */
  searchButtonLabel?: string;
  /** Optional flag to show the search button */
  showSearchButton?: boolean;
  /** Optional flag to enable auto-search as you type */
  autoSearch?: boolean;
}

/**
 * A generic search bar component that can work with any data type
 */
function GenericSearchBar<T extends object>({
  onSearch,
  placeholder = "Search...",
  initialQuery = "",
  debounceTime = 300,
  className = "",
  filters = [],
  onClear,
  searchButtonLabel = "Search",
  showSearchButton = false,
  autoSearch = true,
}: GenericSearchBarProps<T>) {
  // State for the search query
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  
  // Reference to the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce the search query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, debounceTime);
  
  // Create search params object
  const searchParams = useMemo<SearchParams<T>>(() => ({
    query: debouncedQuery,
    filters,
  }), [debouncedQuery, filters]);
  
  // Handler for when the search query changes
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // If auto-search is enabled, perform the search when the query changes
    if (autoSearch) {
      startTransition(() => {
        // This will be run after the debounce via the effect below
      });
    }
  }, [autoSearch]);
  
  // Handler for when the search button is clicked
  const handleSearchClick = useCallback(() => {
    onSearch(searchParams);
  }, [onSearch, searchParams]);
  
  // Handler for when the clear button is clicked
  const handleClearClick = useCallback(() => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onClear) {
      onClear();
    }
  }, [onClear]);
  
  // Effect to perform the search when the debounced query changes
  React.useEffect(() => {
    if (autoSearch) {
      onSearch(searchParams);
    }
  }, [autoSearch, debouncedQuery, onSearch, searchParams]);
  
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleQueryChange}
          className="pl-10 pr-10"
          aria-label="Search"
        />
        
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={handleClearClick}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>
      
      {showSearchButton && (
        <Button
          className="ml-2"
          onClick={handleSearchClick}
          disabled={isPending}
        >
          {searchButtonLabel}
        </Button>
      )}
    </div>
  );
}

export default GenericSearchBar;
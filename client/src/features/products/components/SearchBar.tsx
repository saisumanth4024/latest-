import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  setSearchInputValue, 
  setShowSearchSuggestions, 
  selectSearchInputValue,
  selectShowSearchSuggestions,
  setSearchParams,
  addSearchHistoryItem
} from '../productsSlice';
import { useGetSuggestedSearchesQuery, useGetHotSearchTagsQuery } from '../productsApi';
import { cn } from '@/lib/utils';
import { 
  Search as SearchIcon, 
  Mic as MicIcon, 
  X as XIcon,
  Flame as TrendingIcon 
} from 'lucide-react';
import { Button } from '@/components/ui';

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const searchInputValue = useAppSelector(selectSearchInputValue);
  const showSuggestions = useAppSelector(selectShowSearchSuggestions);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // RTK Query hooks
  const { data: suggestedSearches = [] } = useGetSuggestedSearchesQuery(searchInputValue, {
    skip: !searchInputValue || searchInputValue.length < 2,
  });
  
  const { data: hotSearchTags = [] } = useGetHotSearchTagsQuery();

  // Debounced search handler
  const debouncedSearch = useRef(
    debounce((value: string) => {
      if (value.trim()) {
        dispatch(setSearchParams({ query: value, page: 1 }));
      }
    }, 500)
  ).current;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchInputValue(value));
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      // If the search input is cleared, reset the search query
      dispatch(setSearchParams({ query: undefined }));
    }
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchInputValue.trim()) {
      dispatch(setSearchParams({ query: searchInputValue, page: 1 }));
      dispatch(setShowSearchSuggestions(false));
      
      // Add to search history
      dispatch(addSearchHistoryItem({
        query: searchInputValue,
        timestamp: new Date().toISOString(),
      }));
      
      // Blur the input
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setSearchInputValue(suggestion));
    dispatch(setSearchParams({ query: suggestion, page: 1 }));
    dispatch(setShowSearchSuggestions(false));
    
    // Add to search history
    dispatch(addSearchHistoryItem({
      query: suggestion,
      timestamp: new Date().toISOString(),
    }));
  };

  // Clear search input
  const handleClear = () => {
    dispatch(setSearchInputValue(''));
    dispatch(setSearchParams({ query: undefined }));
    
    // Focus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Mock function for voice search (would normally use Web Speech API)
  const handleVoiceSearch = () => {
    alert('Voice search clicked! This would activate the device microphone in a real implementation.');
    // In a real implementation:
    // 1. Request microphone access
    // 2. Start recognition
    // 3. Update the search input with the recognized text
    // 4. Submit the search
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        dispatch(setShowSearchSuggestions(false));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // Helper function for debouncing
  function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return function(this: any, ...args: Parameters<F>) {
      const context = this;
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 text-gray-400 h-5 w-5" />
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchInputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              dispatch(setShowSearchSuggestions(true));
            }}
            className={cn(
              "w-full h-11 pl-10 pr-20 rounded-full border border-gray-300",
              "focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none",
              "dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all"
            )}
          />
          
          {searchInputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
          
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={cn(
              "absolute right-3 p-2 rounded-full text-gray-500",
              "hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            )}
            aria-label="Search by voice"
          >
            <MicIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestions && (isFocused || suggestedSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {searchInputValue && suggestedSearches.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                <SearchIcon className="h-4 w-4 mr-2" />
                <span>Suggestions</span>
              </div>
              
              <ul>
                {suggestedSearches.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <span className="flex items-center">
                        <SearchIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {suggestion}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : !searchInputValue && hotSearchTags.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                <TrendingIcon className="h-4 w-4 mr-2" />
                <span>Popular Searches</span>
              </div>
              
              <div className="px-3 py-2 flex flex-wrap gap-2">
                {hotSearchTags.map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(tag)}
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Type to search for products
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
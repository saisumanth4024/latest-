import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSearchQuery, selectSearchHistory } from '../productsSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, X, Search, Clock, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const dispatch = useDispatch();
  const searchHistory = useSelector(selectSearchHistory);
  
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchValue(transcript);
        handleSearch(transcript);
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      setRecognitionSupported(true);
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Handle clicks outside of suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };
  
  const handleClearSearch = () => {
    setSearchValue('');
    inputRef.current?.focus();
  };
  
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    dispatch(addSearchQuery(query));
    onSearch(query);
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(searchValue);
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    handleSearch(suggestion);
  };
  
  const handleVoiceSearch = () => {
    if (isRecording) {
      recognitionRef.current?.abort();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };
  
  // Get trending searches from API or from Redux store
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  
  // Fetch trending searches
  useEffect(() => {
    // This would normally be an API call to get real trending data
    // For now, we'll simulate a fetch with more relevant product categories
    const fetchTrendingSearches = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Dynamic trending searches based on current popular categories
      setTrendingSearches([
        'premium headphones',
        'smartphone accessories',
        'ergonomic keyboards',
        'bluetooth speakers',
        'gaming laptops',
        'smart home devices',
        'fitness wearables'
      ]);
    };
    
    fetchTrendingSearches();
  }, []);
  
  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              className={`pr-10 ${isFocused ? 'border-primary' : ''}`}
            />
            
            {searchValue && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Voice search button */}
          {recognitionSupported && (
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              className="h-10 ml-1"
              onClick={handleVoiceSearch}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            className="h-10 ml-1"
            onClick={() => handleSearch(searchValue)}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 max-h-96 overflow-y-auto"
        >
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Searches
              </div>
              <ul>
                {searchHistory.slice(0, 5).map((historyItem, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(historyItem.query)}
                  >
                    {historyItem.query}
                  </li>
                ))}
              </ul>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
            </div>
          )}
          
          {/* Trending Searches */}
          <div>
            <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Searches
            </div>
            <ul>
              {trendingSearches.map((trend, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(trend)}
                >
                  {trend}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
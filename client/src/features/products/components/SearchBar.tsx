import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSearchQuery, selectSearchHistory } from '../productsSlice';
import { useGetProductsQuery } from '../productsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, X, Search, Clock, TrendingUp, Sparkles, Tag, ArrowUpRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const dispatch = useDispatch();
  const searchHistory = useSelector(selectSearchHistory);
  
  // Fetch product data for suggestions
  const { data: productData } = useGetProductsQuery({ 
    sortBy: 'rating',
    sortOrder: 'desc',
    limit: 5
  });
  
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
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
  
  // Filter products when search value changes
  useEffect(() => {
    if (productData?.products && searchValue.trim()) {
      const filtered = productData.products.filter(product => 
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchValue, productData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  
  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };
  
  const handleClearSearch = () => {
    setSearchValue('');
    setFilteredProducts([]);
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
  
  // Generate trending searches from top categories and product tags
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  
  // Generate trending searches from product data
  useEffect(() => {
    if (productData?.products) {
      // Extract popular categories
      const categories = productData.products.map(p => p.category);
      const uniqueCategories = Array.from(new Set(categories));
      setPopularCategories(uniqueCategories.slice(0, 4));
      
      // Extract tags from top-rated products
      const topProductTags = productData.products
        .slice(0, 5)
        .flatMap(p => p.tags);
        
      // Create trending searches from product tags
      const uniqueTags = Array.from(new Set(topProductTags))
        .map(tag => tag.replace('-', ' '))
        .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
        
      setTrendingSearches(uniqueTags.slice(0, 7));
    }
  }, [productData]);
  
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
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-3 max-h-[500px] overflow-y-auto"
        >
          {/* Product Matches */}
          {filteredProducts.length > 0 && (
            <div className="mb-3">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                <span>Matching Products</span>
              </div>
              <ul className="pt-1">
                {filteredProducts.map((product) => (
                  <li 
                    key={product.id}
                    className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => handleSuggestionClick(product.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <img 
                          src={`${product.image}?w=100&h=100&fit=crop&auto=format`} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary font-bold text-sm">${product.discountPrice || product.price}</span>
                          {product.discountPrice && (
                            <span className="text-gray-400 text-xs line-through">${product.price}</span>
                          )}
                          <Badge variant="outline" className="ml-auto text-xs capitalize bg-primary/10">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mx-4 mt-2 mb-1">
                <button 
                  className="w-full py-1.5 text-xs text-center text-primary hover:underline"
                  onClick={() => handleSearch(searchValue)}
                >
                  View all results
                </button>
              </div>
              <hr className="mx-4 my-2 border-gray-200 dark:border-gray-700" />
            </div>
          )}

          {/* Popular Categories */}
          {popularCategories.length > 0 && searchValue.length < 2 && (
            <div className="mb-3">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                <span>Popular Categories</span>
              </div>
              <div className="flex flex-wrap gap-2 px-4 py-2">
                {popularCategories.map((category, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="px-3 py-1 hover:bg-primary/10 cursor-pointer transition-colors capitalize"
                    onClick={() => handleSuggestionClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <hr className="mx-4 my-2 border-gray-200 dark:border-gray-700" />
            </div>
          )}
          
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="mb-3">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>Recent Searches</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {searchHistory.slice(0, 6).map((historyItem, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-sm flex items-center"
                    onClick={() => handleSuggestionClick(historyItem.query)}
                  >
                    <Clock className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="truncate">{historyItem.query}</span>
                  </div>
                ))}
              </div>
              <hr className="mx-4 my-2 border-gray-200 dark:border-gray-700" />
            </div>
          )}
          
          {/* Trending Searches */}
          <div>
            <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              <span>Trending Now</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {trendingSearches.map((trend, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer text-sm flex items-center group"
                  onClick={() => handleSuggestionClick(trend)}
                >
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium mr-2 text-gray-700 dark:text-gray-300 group-hover:bg-primary/20 transition-colors">
                    {index + 1}
                  </span>
                  <span className="truncate group-hover:text-primary transition-colors">{trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
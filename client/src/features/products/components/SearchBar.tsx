import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setQuery, addToSearchHistory, selectSearchParams, selectSearchHistory } from '../productsSlice';
import { 
  Search, 
  Mic, 
  X, 
  History, 
  ArrowUp,
  CornerDownLeft
} from 'lucide-react';
import { 
  Button,
  Input,
  Card,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui';
import { cn } from '@/lib/utils';

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const { query } = useAppSelector(selectSearchParams);
  const searchHistory = useAppSelector(selectSearchHistory);
  
  const [searchValue, setSearchValue] = useState(query || '');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // SpeechRecognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchValue(transcript);
      handleSearch(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
  }
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  
  // Handle search submission
  const handleSearch = (value: string) => {
    if (value.trim()) {
      dispatch(setQuery(value.trim()));
      dispatch(addToSearchHistory(value.trim()));
      setIsInputFocused(false);
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchValue('');
    dispatch(setQuery(null));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Toggle voice search
  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };
  
  // Handle key press for search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
    
    // Handle escape key
    if (e.key === 'Escape') {
      setIsInputFocused(false);
    }
  };
  
  // Handle focus of input
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };
  
  // Handle blur of input
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay blur to allow for clicking on suggestion items
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };
  
  // Handle clicking a history item
  const handleHistoryItemClick = (item: string) => {
    setSearchValue(item);
    handleSearch(item);
  };
  
  // Update local state when Redux state changes
  useEffect(() => {
    setSearchValue(query || '');
  }, [query]);
  
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, brands, categories..."
          className="pl-10 pr-20 h-12 w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus-visible:ring-blue-500"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {recognition && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700",
                isListening && "text-red-500 animate-pulse"
              )}
              onClick={handleVoiceSearch}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="primary"
            size="sm"
            className="h-8 ml-1"
            onClick={() => handleSearch(searchValue)}
          >
            Search
          </Button>
        </div>
      </div>
      
      {/* Search Suggestions Dropdown */}
      {isInputFocused && searchHistory.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-10 p-0 shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <Command className="border-0">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Recent Searches">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <CommandItem
                    key={index}
                    value={item}
                    onSelect={() => handleHistoryItemClick(item)}
                    className="flex items-center cursor-pointer"
                  >
                    <History className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{item}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              {searchValue && (
                <CommandGroup heading="Search">
                  <CommandItem 
                    value={searchValue} 
                    onSelect={() => handleSearch(searchValue)}
                    className="flex items-center cursor-pointer"
                  >
                    <Search className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{searchValue}</span>
                    <CornerDownLeft className="ml-auto h-4 w-4 text-gray-500" />
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </Card>
      )}
      
      {/* Voice Search Active Indicator */}
      {isListening && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 p-6 text-center animate-in zoom-in-90">
            <div className="mx-auto rounded-full bg-red-100 p-6 mb-4 relative">
              <Mic className="h-12 w-12 text-red-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75"></div>
            </div>
            <h2 className="text-xl font-bold mb-2">Listening...</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Speak now or</p>
            <Button onClick={() => recognition?.stop()}>Cancel</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  setQuery, 
  clearQuery, 
  fetchSuggestions, 
  selectQuery, 
  selectSuggestions, 
  selectIsSuggestionsLoading,
  saveSearchToHistory,
  loadSearchHistory,
  selectRecentSearches,
  removeRecentSearch,
  clearRecentSearches,
  startVoiceSearch,
  selectVoiceSearch
} from '../searchSlice';
import { AppDispatch } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from '@/components/ui/command';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Search,
  Mic,
  MicOff,
  Clock,
  X,
  Trash2,
  ChevronRight,
  Tag,
  Layers,
  Store,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimeAgo } from '@/lib/utils';

export default function GlobalSearch() {
  const dispatch = useDispatch<AppDispatch>();
  const [, navigate] = useLocation();
  const query = useSelector(selectQuery);
  const suggestions = useSelector(selectSuggestions);
  const isLoading = useSelector(selectIsSuggestionsLoading);
  const recentSearches = useSelector(selectRecentSearches);
  const voiceSearch = useSelector(selectVoiceSearch);
  
  const [open, setOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const debouncedQuery = useDebounce(localQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    dispatch(loadSearchHistory());
  }, [dispatch]);
  
  // Fetch suggestions based on debounced query
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      dispatch(fetchSuggestions(debouncedQuery));
      dispatch(setQuery(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);
  
  // Update local query when voice search is active
  useEffect(() => {
    if (voiceSearch.transcript) {
      setLocalQuery(voiceSearch.transcript);
    }
  }, [voiceSearch.transcript]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      dispatch(saveSearchToHistory(localQuery));
      navigate(`/search?q=${encodeURIComponent(localQuery)}`);
      setOpen(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    dispatch(saveSearchToHistory(suggestion));
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setOpen(false);
  };
  
  const handleRecentSearchClick = (searchItem: { id: string; query: string }) => {
    setLocalQuery(searchItem.query);
    dispatch(setQuery(searchItem.query));
    navigate(`/search?q=${encodeURIComponent(searchItem.query)}`);
    setOpen(false);
  };
  
  const handleRemoveRecentSearch = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeRecentSearch(id));
  };
  
  const handleClearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(clearRecentSearches());
  };
  
  const handleStartVoiceSearch = () => {
    dispatch(startVoiceSearch());
  };
  
  const renderSuggestionIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Layers className="h-4 w-4 text-muted-foreground" />;
      case 'category':
        return <Layers className="h-4 w-4 text-muted-foreground" />;
      case 'brand':
        return <Store className="h-4 w-4 text-muted-foreground" />;
      case 'tag':
        return <Tag className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getSuggestionDisplayText = (suggestion: any) => {
    if (suggestion.type === 'tag') {
      return (
        <div className="flex items-center">
          {renderSuggestionIcon(suggestion.type)}
          <span className="ml-2 text-sm">{suggestion.text}</span>
          <Badge variant="outline" className="ml-2 text-xs">Tag</Badge>
        </div>
      );
    } else if (suggestion.type === 'brand') {
      return (
        <div className="flex items-center">
          {renderSuggestionIcon(suggestion.type)}
          <span className="ml-2 text-sm">{suggestion.text}</span>
          <Badge variant="outline" className="ml-2 text-xs">Brand</Badge>
        </div>
      );
    } else if (suggestion.type === 'category') {
      return (
        <div className="flex items-center">
          {renderSuggestionIcon(suggestion.type)}
          <span className="ml-2 text-sm">{suggestion.text}</span>
          <Badge variant="outline" className="ml-2 text-xs">Category</Badge>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          {renderSuggestionIcon(suggestion.type)}
          <span className="ml-2 text-sm">{suggestion.text}</span>
          {suggestion.type === 'product' && (
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          )}
        </div>
      );
    }
  };
  
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between md:w-[300px] lg:w-[500px]"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              <span className="truncate">
                {query || "Search products, brands, categories..."}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 md:w-[500px]" align="start">
          <Command shouldFilter={false}>
            <form onSubmit={handleSubmit} className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                ref={inputRef}
                value={localQuery}
                onValueChange={setLocalQuery}
                className="flex-1"
                placeholder="Search products, brands, categories..."
                autoFocus
              />
              {localQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setLocalQuery('');
                    dispatch(clearQuery());
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 ml-1",
                  voiceSearch.isListening && "text-primary"
                )}
                onClick={handleStartVoiceSearch}
                disabled={voiceSearch.isListening}
              >
                {voiceSearch.isListening ? (
                  <Mic className="h-4 w-4 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </form>
            <CommandList>
              {voiceSearch.error && (
                <div className="px-4 py-2 text-sm text-red-500">
                  Error: {voiceSearch.error}
                </div>
              )}
              {isLoading && (
                <div className="py-6 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              {!isLoading && localQuery && !suggestions.length && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  <ScrollArea className="h-[200px]">
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.id}
                        value={suggestion.text}
                        onSelect={() => handleSuggestionClick(suggestion.text)}
                        className="flex items-center"
                      >
                        {suggestion.thumbnail && (
                          <img
                            src={suggestion.thumbnail}
                            alt={suggestion.text}
                            className="mr-2 h-8 w-8 rounded object-cover"
                          />
                        )}
                        {getSuggestionDisplayText(suggestion)}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              )}
              {recentSearches.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Recent Searches">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs text-muted-foreground">Recent searches</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleClearAllRecentSearches}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {recentSearches.map((search) => (
                        <CommandItem
                          key={search.id}
                          value={search.query}
                          onSelect={() => handleRecentSearchClick(search)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{search.query}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(new Date(search.timestamp))}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => handleRemoveRecentSearch(e, search.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </>
              )}
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    if (localQuery.trim()) {
                      handleSubmit(new Event('submit') as any);
                    } else {
                      navigate('/search');
                    }
                    setOpen(false);
                  }}
                  className="justify-center text-center"
                >
                  <div className="flex items-center">
                    <span>View all search results</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
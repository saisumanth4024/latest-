import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { ProductFilters } from '@/features/products/productsApi';

export interface AutoSuggestion {
  id: string;
  type: 'product' | 'category' | 'brand' | 'tag' | 'content';
  text: string;
  thumbnail?: string;
}

export interface HotTag {
  id: string;
  name: string;
  count: number;
  trending: boolean;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
}

export interface VoiceSearchState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export interface SearchState {
  query: string;
  recentSearches: SearchHistory[];
  suggestions: AutoSuggestion[];
  hotTags: HotTag[];
  filters: ProductFilters;
  isSuggestionsLoading: boolean;
  voiceSearch: VoiceSearchState;
  selectedCategory: string | null;
  selectedBrands: string[];
  priceRange: [number, number];
  selectedTags: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'relevance' | 'price' | 'newest' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

const initialState: SearchState = {
  query: '',
  recentSearches: [],
  suggestions: [],
  hotTags: [],
  filters: {},
  isSuggestionsLoading: false,
  voiceSearch: {
    isListening: false,
    transcript: '',
    error: null
  },
  selectedCategory: null,
  selectedBrands: [],
  priceRange: [0, 1000],
  selectedTags: [],
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'relevance',
  sortOrder: 'desc'
};

// Save search to history
export const saveSearchToHistory = createAsyncThunk(
  'search/saveToHistory',
  async (query: string, { getState }) => {
    const state = getState() as RootState;
    const recentSearches = state.search.recentSearches;
    
    // Add search to history and save to localStorage
    const searchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now()
    };
    
    // Store in localStorage
    const updatedHistory = [searchHistory, ...recentSearches.slice(0, 9)];
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    return searchHistory;
  }
);

// Load search history
export const loadSearchHistory = createAsyncThunk(
  'search/loadHistory',
  async () => {
    const historyJson = localStorage.getItem('searchHistory');
    return historyJson ? JSON.parse(historyJson) : [];
  }
);

// Fetch auto-suggestions based on query
export const fetchSuggestions = createAsyncThunk(
  'search/fetchSuggestions',
  async (query: string, { rejectWithValue }) => {
    if (!query || query.length < 2) return [];
    
    try {
      // In a real app, this would call an API
      // For now, we'll simulate a response with mock data
      // This would be replaced with actual API calls in production
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return a sample array of suggestions based on the query
      const suggestions: AutoSuggestion[] = [
        { 
          id: '1', 
          type: 'product', 
          text: `${query} wireless headphones`,
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop'
        },
        { 
          id: '2', 
          type: 'category', 
          text: 'Electronics'
        },
        { 
          id: '3', 
          type: 'brand', 
          text: 'SoundMaster'
        },
        { 
          id: '4', 
          type: 'tag', 
          text: 'wireless'
        },
        { 
          id: '5', 
          type: 'product', 
          text: `${query} premium speakers`,
          thumbnail: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=50&h=50&fit=crop'
        }
      ];
      
      return suggestions;
    } catch (error) {
      return rejectWithValue('Failed to fetch suggestions');
    }
  }
);

// Fetch hot/trending tags
export const fetchHotTags = createAsyncThunk(
  'search/fetchHotTags',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return a sample array of hot tags
      const hotTags: HotTag[] = [
        { id: '1', name: 'wireless', count: 125, trending: true },
        { id: '2', name: 'headphones', count: 98, trending: true },
        { id: '3', name: 'bluetooth', count: 87, trending: false },
        { id: '4', name: 'gaming', count: 76, trending: true },
        { id: '5', name: '4k', count: 65, trending: false },
        { id: '6', name: 'smart-home', count: 54, trending: true },
      ];
      
      return hotTags;
    } catch (error) {
      return rejectWithValue('Failed to fetch hot tags');
    }
  }
);

// Start voice search
export const startVoiceSearch = createAsyncThunk(
  'search/startVoiceSearch',
  async (_, { dispatch }) => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser');
      }
      
      // Use the browser's Speech Recognition API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        dispatch(updateVoiceTranscript(transcript));
      };
      
      recognition.onerror = (event) => {
        dispatch(setVoiceError(event.error));
        dispatch(stopVoiceSearch());
      };
      
      recognition.onend = () => {
        dispatch(stopVoiceSearch());
      };
      
      recognition.start();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'An unknown error occurred';
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = '';
      state.suggestions = [];
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem('searchHistory');
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(s => s.id !== action.payload);
      localStorage.setItem('searchHistory', JSON.stringify(state.recentSearches));
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    updateVoiceTranscript: (state, action: PayloadAction<string>) => {
      state.voiceSearch.transcript = action.payload;
      state.query = action.payload;
    },
    setVoiceError: (state, action: PayloadAction<string>) => {
      state.voiceSearch.error = action.payload;
    },
    stopVoiceSearch: (state) => {
      state.voiceSearch.isListening = false;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.filters = {
        ...state.filters,
        category: action.payload || undefined
      };
    },
    setSelectedBrands: (state, action: PayloadAction<string[]>) => {
      state.selectedBrands = action.payload;
      state.filters = {
        ...state.filters,
        brand: action.payload.length > 0 ? action.payload : undefined
      };
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
      state.filters = {
        ...state.filters,
        minPrice: action.payload[0],
        maxPrice: action.payload[1]
      };
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
      state.filters = {
        ...state.filters,
        tags: action.payload.length > 0 ? action.payload : undefined
      };
    },
    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
      state.filters = {
        ...state.filters,
        inStock: action.payload || undefined
      };
    },
    setOnSaleOnly: (state, action: PayloadAction<boolean>) => {
      state.onSaleOnly = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'relevance' | 'price' | 'newest' | 'popularity'>) => {
      state.sortBy = action.payload;
      
      // Map to the product API's sortBy field
      let sortByField: 'price' | 'name' | 'rating' | 'newest' | undefined;
      switch (action.payload) {
        case 'price':
          sortByField = 'price';
          break;
        case 'newest':
          sortByField = 'newest';
          break;
        case 'popularity':
          sortByField = 'rating';
          break;
        default:
          sortByField = undefined;
      }
      
      state.filters = {
        ...state.filters,
        sortBy: sortByField
      };
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      state.filters = {
        ...state.filters,
        sortOrder: action.payload
      };
    },
    resetFilters: (state) => {
      state.selectedCategory = null;
      state.selectedBrands = [];
      state.priceRange = [0, 1000];
      state.selectedTags = [];
      state.inStockOnly = false;
      state.onSaleOnly = false;
      state.sortBy = 'relevance';
      state.sortOrder = 'desc';
      state.filters = {
        search: state.query
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSearchToHistory.fulfilled, (state, action) => {
        // Ensure no duplicates by removing any existing entry with same query
        state.recentSearches = state.recentSearches.filter(s => 
          s.query.toLowerCase() !== action.payload.query.toLowerCase()
        );
        state.recentSearches.unshift(action.payload);
        // Keep only the 10 most recent searches
        if (state.recentSearches.length > 10) {
          state.recentSearches = state.recentSearches.slice(0, 10);
        }
      })
      .addCase(loadSearchHistory.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      })
      .addCase(fetchSuggestions.pending, (state) => {
        state.isSuggestionsLoading = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.isSuggestionsLoading = false;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestions = [];
        state.isSuggestionsLoading = false;
      })
      .addCase(fetchHotTags.fulfilled, (state, action) => {
        state.hotTags = action.payload;
      })
      .addCase(startVoiceSearch.pending, (state) => {
        state.voiceSearch.isListening = true;
        state.voiceSearch.error = null;
        state.voiceSearch.transcript = '';
      })
      .addCase(startVoiceSearch.fulfilled, (state, action) => {
        if (typeof action.payload === 'string') {
          state.voiceSearch.error = action.payload;
          state.voiceSearch.isListening = false;
        }
      })
      .addCase(startVoiceSearch.rejected, (state, action) => {
        state.voiceSearch.isListening = false;
        state.voiceSearch.error = action.error.message || 'An error occurred';
      });
  }
});

export const {
  setQuery,
  clearQuery,
  clearRecentSearches,
  removeRecentSearch,
  clearSuggestions,
  updateVoiceTranscript,
  setVoiceError,
  stopVoiceSearch,
  setSelectedCategory,
  setSelectedBrands,
  setPriceRange,
  setSelectedTags,
  setInStockOnly,
  setOnSaleOnly,
  setSortBy,
  setSortOrder,
  resetFilters
} = searchSlice.actions;

// Selectors
export const selectQuery = (state: RootState) => state.search.query;
export const selectRecentSearches = (state: RootState) => state.search.recentSearches;
export const selectSuggestions = (state: RootState) => state.search.suggestions;
export const selectIsSuggestionsLoading = (state: RootState) => state.search.isSuggestionsLoading;
export const selectHotTags = (state: RootState) => state.search.hotTags;
export const selectVoiceSearch = (state: RootState) => state.search.voiceSearch;
export const selectSearchFilters = (state: RootState) => state.search.filters;
export const selectSelectedCategory = (state: RootState) => state.search.selectedCategory;
export const selectSelectedBrands = (state: RootState) => state.search.selectedBrands;
export const selectPriceRange = (state: RootState) => state.search.priceRange;
export const selectSelectedTags = (state: RootState) => state.search.selectedTags;
export const selectInStockOnly = (state: RootState) => state.search.inStockOnly;
export const selectOnSaleOnly = (state: RootState) => state.search.onSaleOnly;
export const selectSortBy = (state: RootState) => state.search.sortBy;
export const selectSortOrder = (state: RootState) => state.search.sortOrder;

export default searchSlice.reducer;
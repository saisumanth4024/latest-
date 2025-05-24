import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

interface ComparisonItem {
  productId: number;
  addedAt: number;
}

interface RecentlyViewedItem {
  productId: number;
  viewedAt: number;
}

interface ProductsState {
  filters: {
    category: string | null;
    priceRange: [number, number] | null;
    rating: number | null;
    sort: 'price-asc' | 'price-desc' | 'rating' | 'newest' | null;
  };
  searchHistory: SearchHistoryItem[];
  comparison: ComparisonItem[];
  recentlyViewed: RecentlyViewedItem[];
  currentSearchQuery: string;
}

const initialState: ProductsState = {
  filters: {
    category: null,
    priceRange: null,
    rating: null,
    sort: null,
  },
  searchHistory: [],
  comparison: [],
  recentlyViewed: [],
  currentSearchQuery: '',
};

// Maximum number of items to keep in each list
const MAX_SEARCH_HISTORY = 10;
const MAX_COMPARISON_ITEMS = 4;
const MAX_RECENTLY_VIEWED = 12;

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.currentSearchQuery = action.payload;
    },
    
    addSearchQuery: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;
      
      // Remove if exists already (to move to top)
      state.searchHistory = state.searchHistory.filter(
        item => item.query.toLowerCase() !== query.toLowerCase()
      );
      
      // Add to beginning
      state.searchHistory.unshift({
        query,
        timestamp: Date.now()
      });
      
      // Trim list if needed
      if (state.searchHistory.length > MAX_SEARCH_HISTORY) {
        state.searchHistory = state.searchHistory.slice(0, MAX_SEARCH_HISTORY);
      }
      
      // Update current search query
      state.currentSearchQuery = query;
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    // Filter actions
    setFilter: (state, action: PayloadAction<{
      key: keyof ProductsState['filters']; 
      value: any;
    }>) => {
      const { key, value } = action.payload;
      // @ts-ignore - we know this is a valid key
      state.filters[key] = value;
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Comparison actions
    addToComparison: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      
      // Check if already exists
      if (state.comparison.some(item => item.productId === productId)) {
        return;
      }
      
      // Add to beginning
      state.comparison.unshift({
        productId,
        addedAt: Date.now()
      });
      
      // Trim list if needed
      if (state.comparison.length > MAX_COMPARISON_ITEMS) {
        state.comparison = state.comparison.slice(0, MAX_COMPARISON_ITEMS);
      }
    },
    
    removeFromComparison: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.comparison = state.comparison.filter(item => item.productId !== productId);
    },
    
    clearComparison: (state) => {
      state.comparison = [];
    },
    
    // Recently viewed actions
    addToRecentlyViewed: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      
      // Remove if exists already (to move to top)
      state.recentlyViewed = state.recentlyViewed.filter(
        item => item.productId !== productId
      );
      
      // Add to beginning
      state.recentlyViewed.unshift({
        productId,
        viewedAt: Date.now()
      });
      
      // Trim list if needed
      if (state.recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        state.recentlyViewed = state.recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
      }
    },
    
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    }
  },
});

// Export actions
export const {
  setSearchQuery,
  addSearchQuery,
  clearSearchHistory,
  setFilter,
  resetFilters,
  addToComparison,
  removeFromComparison,
  clearComparison,
  addToRecentlyViewed,
  clearRecentlyViewed
} = productsSlice.actions;

// Export selectors
export const selectSearchHistory = (state: RootState) => state.products.searchHistory;
export const selectCurrentSearchQuery = (state: RootState) => state.products.currentSearchQuery;
export const selectFilters = (state: RootState) => state.products.filters;
export const selectComparison = (state: RootState) => state.products.comparison;
export const selectRecentlyViewed = (state: RootState) => state.products.recentlyViewed;

export default productsSlice.reducer;
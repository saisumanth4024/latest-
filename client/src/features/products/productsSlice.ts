import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { ProductFilters } from './productsApi';

// Define types for our state
interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export interface ProductsState {
  filters: ProductFilters;
  searchHistory: SearchHistoryItem[];
  selectedProductId: number | null;
  recentlyViewedIds: number[];
  viewHistory: {
    productId: number;
    timestamp: number;
  }[];
}

// Create entity adapter for search history items
const searchHistoryAdapter = createEntityAdapter<SearchHistoryItem>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => b.timestamp - a.timestamp,
});

// Initial state
const initialState: ProductsState = {
  filters: {
    page: 1,
    limit: 12,
    sortBy: 'newest',
    sortOrder: 'desc',
  },
  searchHistory: [],
  selectedProductId: null,
  recentlyViewedIds: [],
  viewHistory: [],
};

// Create the slice
export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Update filters
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      
      // Reset to page 1 when filters change (except when explicitly changing page)
      if (!action.payload.page) {
        state.filters.page = 1;
      }
    },
    
    // Reset filters to defaults except for any specified to keep
    resetFilters: (state, action: PayloadAction<string[] | undefined>) => {
      const keysToKeep = action.payload || [];
      const currentFilters = { ...state.filters };
      
      // Reset to initial filters
      state.filters = { ...initialState.filters };
      
      // Restore values for keys we want to keep
      keysToKeep.forEach(key => {
        if (key in currentFilters) {
          state.filters[key as keyof ProductFilters] = currentFilters[key as keyof ProductFilters];
        }
      });
    },
    
    // Search actions
    addSearchQuery: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;
      
      // Add to search history if it doesn't already exist
      const existingIndex = state.searchHistory.findIndex(item => item.query.toLowerCase() === query.toLowerCase());
      
      if (existingIndex >= 0) {
        // Move to top if exists
        const existing = state.searchHistory[existingIndex];
        state.searchHistory.splice(existingIndex, 1);
        state.searchHistory.unshift({
          ...existing,
          timestamp: Date.now(),
        });
      } else {
        // Add new entry
        state.searchHistory.unshift({
          id: Date.now().toString(),
          query,
          timestamp: Date.now(),
        });
      }
      
      // Keep only the most recent 10 searches
      if (state.searchHistory.length > 10) {
        state.searchHistory.pop();
      }
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    // Product selection
    selectProduct: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.selectedProductId = productId;
      
      // Add to view history
      state.viewHistory.push({
        productId,
        timestamp: Date.now(),
      });
      
      // Keep most recent 20 viewed products
      if (state.viewHistory.length > 20) {
        state.viewHistory.shift();
      }
      
      // Update recently viewed IDs (no duplicates)
      if (!state.recentlyViewedIds.includes(productId)) {
        state.recentlyViewedIds.push(productId);
        if (state.recentlyViewedIds.length > 10) {
          state.recentlyViewedIds.shift();
        }
      } else {
        // Move to end of array if already exists
        const index = state.recentlyViewedIds.indexOf(productId);
        state.recentlyViewedIds.splice(index, 1);
        state.recentlyViewedIds.push(productId);
      }
    },
    
    clearSelectedProduct: (state) => {
      state.selectedProductId = null;
    },
    
    clearViewHistory: (state) => {
      state.viewHistory = [];
      state.recentlyViewedIds = [];
    },
  },
});

// Export actions
export const {
  updateFilters,
  resetFilters,
  addSearchQuery,
  clearSearchHistory,
  selectProduct,
  clearSelectedProduct,
  clearViewHistory,
} = productsSlice.actions;

// Export selectors
export const selectProductFilters = (state: RootState) => state.products.filters;
export const selectSearchHistory = (state: RootState) => state.products.searchHistory;
export const selectSelectedProductId = (state: RootState) => state.products.selectedProductId;
export const selectRecentlyViewedIds = (state: RootState) => state.products.recentlyViewedIds;
export const selectViewHistory = (state: RootState) => state.products.viewHistory;

export default productsSlice.reducer;
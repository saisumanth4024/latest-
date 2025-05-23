import { createSlice, createEntityAdapter, PayloadAction, createSelector, EntityId } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { SearchParams, SearchHistoryItem, SortOption } from './types';

// Create entity adapter for search history
const searchHistoryAdapter = createEntityAdapter<SearchHistoryItem & { id: string }>({
  selectId: (item) => item.id,
  sortComparer: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
});

// Initial state for products slice
interface ProductsState {
  searchParams: SearchParams;
  searchHistory: ReturnType<typeof searchHistoryAdapter.getInitialState>;
  visibleRange: {
    startIndex: number;
    endIndex: number;
  };
  viewMode: 'grid' | 'list';
  isSidebarOpen: boolean;
}

const initialState: ProductsState = {
  searchParams: {
    query: null,
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    sort: 'relevance',
    page: 1,
    limit: 24,
  },
  searchHistory: searchHistoryAdapter.getInitialState(),
  visibleRange: {
    startIndex: 0,
    endIndex: 0,
  },
  viewMode: 'grid',
  isSidebarOpen: false,
};

// Create products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set search query
    setQuery: (state, action: PayloadAction<string | null>) => {
      state.searchParams.query = action.payload;
      state.searchParams.page = 1; // Reset to first page
    },
    
    // Add item to search history
    addSearchHistoryItem: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query) {
        const timestamp = new Date().toISOString();
        const id = `${query}-${timestamp}`;
        
        // Check if this query already exists and remove it to avoid duplicates
        const existingItems = Object.values(state.searchHistory.entities)
          .filter(item => item && item.query.toLowerCase() === query.toLowerCase());
        
        if (existingItems.length > 0) {
          searchHistoryAdapter.removeMany(
            state.searchHistory, 
            existingItems.map(item => item?.id as string)
          );
        }
        
        // Add new item
        searchHistoryAdapter.addOne(state.searchHistory, {
          id,
          query,
          timestamp,
        });
        
        // Keep only the latest 10 searches
        const allIds = state.searchHistory.ids as string[];
        if (allIds.length > 10) {
          const idsToRemove = allIds.slice(10);
          searchHistoryAdapter.removeMany(state.searchHistory, idsToRemove);
        }
      }
    },
    
    // Clear search history
    clearSearchHistory: (state) => {
      searchHistoryAdapter.removeAll(state.searchHistory);
    },
    
    // Set category filter
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.searchParams.category = action.payload;
      state.searchParams.page = 1; // Reset to first page
    },
    
    // Set brand filter
    setBrand: (state, action: PayloadAction<string | null>) => {
      state.searchParams.brand = action.payload;
      state.searchParams.page = 1; // Reset to first page
    },
    
    // Set price range filter
    setPriceRange: (state, action: PayloadAction<{ minPrice: number | null; maxPrice: number | null }>) => {
      state.searchParams.minPrice = action.payload.minPrice;
      state.searchParams.maxPrice = action.payload.maxPrice;
      state.searchParams.page = 1; // Reset to first page
    },
    
    // Set rating filter
    setRating: (state, action: PayloadAction<number | null>) => {
      state.searchParams.rating = action.payload;
      state.searchParams.page = 1; // Reset to first page
    },
    
    // Set sort option
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.searchParams.sort = action.payload;
    },
    
    // Set pagination page
    setPage: (state, action: PayloadAction<number>) => {
      state.searchParams.page = action.payload;
    },
    
    // Set items per page
    setLimit: (state, action: PayloadAction<number>) => {
      state.searchParams.limit = action.payload;
      state.searchParams.page = 1; // Reset to first page
    },
    
    // Reset all filters
    resetFilters: (state) => {
      state.searchParams = {
        ...initialState.searchParams,
        query: state.searchParams.query, // Preserve search query
        sort: state.searchParams.sort, // Preserve sort option
      };
    },
    
    // Set visible range for virtualized list
    setVisibleRange: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      state.visibleRange = action.payload;
    },
    
    // Set view mode (grid or list)
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    
    // Toggle sidebar visibility
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

// Export actions
export const {
  setQuery,
  addSearchHistoryItem,
  clearSearchHistory,
  setCategory,
  setBrand,
  setPriceRange,
  setRating,
  setSort,
  setPage,
  setLimit,
  resetFilters,
  setVisibleRange,
  setViewMode,
  toggleSidebar,
} = productsSlice.actions;

// Export selectors
export const selectSearchParams = (state: RootState) => state.products.searchParams;
export const selectVisibleRange = (state: RootState) => state.products.visibleRange;
export const selectViewMode = (state: RootState) => state.products.viewMode;
export const selectIsSidebarOpen = (state: RootState) => state.products.isSidebarOpen;

// Export search history selectors
const selectSearchHistoryState = (state: RootState) => state.products.searchHistory;
export const {
  selectAll: selectAllSearchHistory,
  selectById: selectSearchHistoryById,
  selectIds: selectSearchHistoryIds,
} = searchHistoryAdapter.getSelectors(selectSearchHistoryState);

// Export reducer
export default productsSlice.reducer;
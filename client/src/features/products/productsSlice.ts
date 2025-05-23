import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { Product, SearchHistoryItem, ViewedProduct, SearchParams, SortOption } from './types';
import { localStorage } from '@/utils/storage';

// Entity adapter for normalized state management
export const productsAdapter = createEntityAdapter<Product>();
export const viewedProductsAdapter = createEntityAdapter<ViewedProduct>({
  sortComparer: (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
});
export const searchHistoryAdapter = createEntityAdapter<SearchHistoryItem>({
  selectId: (item) => item.query,
  sortComparer: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
});

// Load persisted viewed products and search history from localStorage
const loadViewedProducts = (): ViewedProduct[] => {
  try {
    const data = window.localStorage.getItem('viewedProducts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load viewed products from localStorage', error);
    return [];
  }
};

const loadSearchHistory = (): SearchHistoryItem[] => {
  try {
    const data = window.localStorage.getItem('searchHistory');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load search history from localStorage', error);
    return [];
  }
};

interface ProductsState {
  // Current search/filter parameters
  searchParams: SearchParams;
  // UI state
  searchInputValue: string;
  showSearchSuggestions: boolean;
  isSidebarOpen: boolean;
  viewMode: 'grid' | 'list';
  // Recent searches and viewed products
  viewedProducts: ReturnType<typeof viewedProductsAdapter.getInitialState>;
  searchHistory: ReturnType<typeof searchHistoryAdapter.getInitialState>;
  // Virtualization state
  visibleStartIndex: number;
  visibleEndIndex: number;
}

const initialState: ProductsState = {
  searchParams: {
    page: 1,
    limit: 20,
    sort: 'relevance' as SortOption,
  },
  searchInputValue: '',
  showSearchSuggestions: false,
  isSidebarOpen: true,
  viewMode: 'grid',
  viewedProducts: viewedProductsAdapter.getInitialState(loadViewedProducts()),
  searchHistory: searchHistoryAdapter.getInitialState(loadSearchHistory()),
  visibleStartIndex: 0,
  visibleEndIndex: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Search params actions
    setSearchParams: (state, action: PayloadAction<Partial<SearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload, page: 1 }; // Reset to page 1 when changing filters
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.searchParams.page = action.payload;
    },
    
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.searchParams.sort = action.payload;
      state.searchParams.page = 1; // Reset to page 1 when changing sort
    },
    
    setCategory: (state, action: PayloadAction<string | undefined>) => {
      state.searchParams.category = action.payload;
      state.searchParams.page = 1;
    },
    
    setBrand: (state, action: PayloadAction<string | undefined>) => {
      state.searchParams.brand = action.payload;
      state.searchParams.page = 1;
    },
    
    setPriceRange: (state, action: PayloadAction<{ min?: number; max?: number }>) => {
      state.searchParams.minPrice = action.payload.min;
      state.searchParams.maxPrice = action.payload.max;
      state.searchParams.page = 1;
    },
    
    setRating: (state, action: PayloadAction<number | undefined>) => {
      state.searchParams.rating = action.payload;
      state.searchParams.page = 1;
    },
    
    setFilter: (state, action: PayloadAction<{ key: string; value: string | string[] | number | boolean }>) => {
      const { key, value } = action.payload;
      state.searchParams.filters = { ...state.searchParams.filters, [key]: value };
      state.searchParams.page = 1;
    },
    
    resetFilters: (state) => {
      state.searchParams = {
        page: 1,
        limit: state.searchParams.limit,
        sort: 'relevance',
        query: state.searchParams.query, // Keep the search query
      };
    },
    
    // UI state actions
    setSearchInputValue: (state, action: PayloadAction<string>) => {
      state.searchInputValue = action.payload;
    },
    
    setShowSearchSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSearchSuggestions = action.payload;
    },
    
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    
    // Virtualization actions
    setVisibleRange: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      state.visibleStartIndex = action.payload.startIndex;
      state.visibleEndIndex = action.payload.endIndex;
    },
    
    // Viewed products actions
    addViewedProduct: (state, action: PayloadAction<ViewedProduct>) => {
      viewedProductsAdapter.upsertOne(state.viewedProducts, action.payload);
      
      // Persist to localStorage
      try {
        const allViewedProducts = viewedProductsAdapter.getSelectors().selectAll(state.viewedProducts);
        window.localStorage.setItem('viewedProducts', JSON.stringify(allViewedProducts.slice(0, 20))); // Keep only the most recent 20
      } catch (error) {
        console.error('Failed to save viewed products to localStorage', error);
      }
    },
    
    clearViewedProducts: (state) => {
      viewedProductsAdapter.removeAll(state.viewedProducts);
      window.localStorage.removeItem('viewedProducts');
    },
    
    // Search history actions
    addSearchHistoryItem: (state, action: PayloadAction<SearchHistoryItem>) => {
      searchHistoryAdapter.upsertOne(state.searchHistory, action.payload);
      
      // Persist to localStorage
      try {
        const allSearchHistory = searchHistoryAdapter.getSelectors().selectAll(state.searchHistory);
        window.localStorage.setItem('searchHistory', JSON.stringify(allSearchHistory.slice(0, 10))); // Keep only the most recent 10
      } catch (error) {
        console.error('Failed to save search history to localStorage', error);
      }
    },
    
    removeSearchHistoryItem: (state, action: PayloadAction<string>) => {
      searchHistoryAdapter.removeOne(state.searchHistory, action.payload);
      
      // Update localStorage
      try {
        const allSearchHistory = searchHistoryAdapter.getSelectors().selectAll(state.searchHistory);
        window.localStorage.setItem('searchHistory', JSON.stringify(allSearchHistory));
      } catch (error) {
        console.error('Failed to update search history in localStorage', error);
      }
    },
    
    clearSearchHistory: (state) => {
      searchHistoryAdapter.removeAll(state.searchHistory);
      window.localStorage.removeItem('searchHistory');
    },
  },
});

// Actions
export const {
  setSearchParams,
  setPage,
  setSort,
  setCategory,
  setBrand,
  setPriceRange,
  setRating,
  setFilter,
  resetFilters,
  setSearchInputValue,
  setShowSearchSuggestions,
  setViewMode,
  toggleSidebar,
  setSidebarOpen,
  setVisibleRange,
  addViewedProduct,
  clearViewedProducts,
  addSearchHistoryItem,
  removeSearchHistoryItem,
  clearSearchHistory,
} = productsSlice.actions;

// Selectors
export const selectProductsState = (state: RootState) => state.products;
export const selectSearchParams = (state: RootState) => state.products.searchParams;
export const selectSearchInputValue = (state: RootState) => state.products.searchInputValue;
export const selectShowSearchSuggestions = (state: RootState) => state.products.showSearchSuggestions;
export const selectViewMode = (state: RootState) => state.products.viewMode;
export const selectIsSidebarOpen = (state: RootState) => state.products.isSidebarOpen;
export const selectVisibleRange = (state: RootState) => ({
  startIndex: state.products.visibleStartIndex,
  endIndex: state.products.visibleEndIndex,
});

// Entity selectors
const viewedProductsSelectors = viewedProductsAdapter.getSelectors<RootState>(
  (state) => state.products.viewedProducts
);
export const selectAllViewedProducts = viewedProductsSelectors.selectAll;
export const selectViewedProductsCount = viewedProductsSelectors.selectTotal;

const searchHistorySelectors = searchHistoryAdapter.getSelectors<RootState>(
  (state) => state.products.searchHistory
);
export const selectAllSearchHistory = searchHistorySelectors.selectAll;
export const selectSearchHistoryCount = searchHistorySelectors.selectTotal;

// Memoized selectors
export const selectHasActiveFilters = createSelector(
  selectSearchParams,
  (params) => {
    // Check if any filter is applied except for pagination
    const { page, limit, sort } = params;
    const paramsCopy = { ...params };
    
    // Remove pagination and default sort
    delete paramsCopy.page;
    delete paramsCopy.limit;
    if (paramsCopy.sort === 'relevance') delete paramsCopy.sort;
    
    // Check if there are any filters left
    return Object.keys(paramsCopy).length > 0;
  }
);

export default productsSlice.reducer;
// Main component exports
export { default as ProductsPage } from './components/ProductsPage';

// Slice exports
export {
  updateFilters,
  resetFilters,
  addSearchQuery,
  clearSearchHistory,
  selectProduct,
  clearSelectedProduct,
  clearViewHistory,
  selectProductFilters,
  selectSearchHistory,
  selectSelectedProductId,
  selectRecentlyViewedIds,
  selectViewHistory,
} from './productsSlice';

// API exports
export {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetTagsQuery,
} from './productsApi';

export type { Product, ProductFilters } from './productsApi';
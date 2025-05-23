import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetProductsQuery, 
  useGetCategoriesQuery,
  useGetBrandsQuery
} from '../productsApi';
import { 
  selectProductFilters, 
  updateFilters, 
  resetFilters 
} from '../productsSlice';
import ProductGrid from './ProductGrid';
import FilterSidebar from './FilterSidebar';
import SearchBar from './SearchBar';
import SortOptions from './SortOptions';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectProductFilters);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Fetch products based on current filters
  const { data, isLoading, isFetching, error } = useGetProductsQuery(filters);
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleSearch = (query: string) => {
    dispatch(updateFilters({ search: query }));
  };
  
  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    dispatch(updateFilters({ 
      sortBy: sortBy as any, 
      sortOrder 
    }));
  };
  
  const handlePageChange = (page: number) => {
    dispatch(updateFilters({ page }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearFilters = () => {
    dispatch(resetFilters(['search'])); // Keep search query when clearing filters
  };
  
  // Calculate pagination
  const totalPages = data ? Math.ceil(data.total / (filters.limit || 12)) : 0;
  const currentPage = filters.page || 1;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Search and Filters UI */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="w-full">
          <SearchBar onSearch={handleSearch} initialQuery={filters.search || ''} />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Mobile filter toggle */}
          <Button 
            variant="outline" 
            size="sm"
            className="lg:hidden flex items-center gap-2"
            onClick={toggleMobileSidebar}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>

          {/* Active filter count */}
          {Object.keys(filters).filter(key => 
            key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' && filters[key as keyof typeof filters]
          ).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Clear Filters
            </Button>
          )}
          
          {/* Sort options */}
          <div className="ml-auto">
            <SortOptions 
              sortBy={filters.sortBy || 'newest'} 
              sortOrder={filters.sortOrder || 'desc'} 
              onChange={handleSortChange} 
            />
          </div>
        </div>
      </div>
      
      {/* Main content area with sidebar and products */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar - hidden on mobile unless toggled */}
        <div className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } lg:block lg:w-1/4 p-4 bg-card rounded-lg border shadow-sm`}>
          <FilterSidebar
            categories={categories || []}
            brands={brands || []}
            filters={filters}
            onUpdateFilters={(newFilters) => dispatch(updateFilters(newFilters))}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </div>
        
        {/* Products grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Error loading products</h3>
              <p className="text-red-500 dark:text-red-300 mt-2">
                There was a problem loading the products. Please try again.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => dispatch(resetFilters())}
              >
                Reset Filters
              </Button>
            </div>
          ) : data?.products.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try adjusting your filters or search criteria.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => dispatch(resetFilters())}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Results summary */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {data.products.length} of {data.total} products
                  {isFetching && !isLoading && (
                    <span className="ml-2 inline-block">
                      <Loader2 className="h-3 w-3 animate-spin inline-block" />
                    </span>
                  )}
                </p>
              </div>
              
              {/* Product grid */}
              <ProductGrid products={data.products} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show 5 pages max with current page in middle when possible
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + i;
                      } else {
                        pageToShow = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageToShow}
                          variant={currentPage === pageToShow ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageToShow)}
                        >
                          {pageToShow}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
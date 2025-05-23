import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGetProductsQuery } from '../productsApi';
import { selectSearchParams, toggleSidebar, selectIsSidebarOpen } from '../productsSlice';
import SearchBar from './SearchBar';
import FilterSidebar from './FilterSidebar';
import SortOptions from './SortOptions';
import ProductGrid from './ProductGrid';
import { Button, Badge } from '@/components/ui';
import { 
  Filter as FilterIcon, 
  X as ClearIcon, 
  ChevronLeft as ChevronLeftIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const searchParams = useAppSelector(selectSearchParams);
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);
  
  // Fetch products with RTK Query
  const { 
    data, 
    isLoading, 
    error,
    refetch
  } = useGetProductsQuery(searchParams);
  
  // Refetch when search params change
  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);
  
  // Toggle filter sidebar on mobile
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  
  // Display active filters
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (searchParams.category) {
      activeFilters.push({
        label: `Category: ${searchParams.category}`,
        key: 'category'
      });
    }
    
    if (searchParams.brand) {
      activeFilters.push({
        label: `Brand: ${searchParams.brand}`,
        key: 'brand'
      });
    }
    
    if (searchParams.minPrice || searchParams.maxPrice) {
      const priceLabel = searchParams.minPrice && searchParams.maxPrice
        ? `Price: $${searchParams.minPrice} - $${searchParams.maxPrice}`
        : searchParams.minPrice
        ? `Price: From $${searchParams.minPrice}`
        : `Price: Up to $${searchParams.maxPrice}`;
      
      activeFilters.push({
        label: priceLabel,
        key: 'price'
      });
    }
    
    if (searchParams.rating) {
      activeFilters.push({
        label: `Rating: ${searchParams.rating}★ & Up`,
        key: 'rating'
      });
    }
    
    if (searchParams.query) {
      activeFilters.push({
        label: `Search: "${searchParams.query}"`,
        key: 'query'
      });
    }
    
    return activeFilters;
  };
  
  const activeFilters = renderActiveFilters();
  
  return (
    <div className="container mx-auto px-4 pb-12">
      {/* Search bar */}
      <div className="py-6">
        <SearchBar />
      </div>
      
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-6">
        {/* Filter sidebar */}
        <aside className={cn(
          "md:w-1/4 lg:w-1/5 relative",
          !isSidebarOpen && "hidden md:block"
        )}>
          <FilterSidebar />
        </aside>
        
        {/* Product content */}
        <main className="flex-1">
          <div className="flex flex-col space-y-4">
            {/* Top bar with mobile filter button and sort */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  className="md:hidden flex items-center"
                  onClick={handleToggleSidebar}
                >
                  {isSidebarOpen ? (
                    <>
                      <ChevronLeftIcon className="h-4 w-4 mr-2" />
                      Hide Filters
                    </>
                  ) : (
                    <>
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Show Filters
                    </>
                  )}
                </Button>
                
                {data && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {data.totalCount} {data.totalCount === 1 ? 'product' : 'products'}
                  </div>
                )}
              </div>
              
              <SortOptions />
            </div>
            
            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {activeFilters.map((filter) => (
                  <Badge 
                    key={filter.key} 
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ClearIcon className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Products grid */}
            <div className="relative min-h-[500px]">
              <ProductGrid 
                products={data?.products || []} 
                loading={isLoading} 
                error={error ? 'Failed to load products. Please try again.' : undefined}
              />
              
              {/* Empty state */}
              {!isLoading && data?.products && data.products.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Clear all filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
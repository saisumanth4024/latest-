import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../productsApi';
import { 
  selectFilters, 
  setFilter,
  resetFilters 
} from '../productsSlice';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Simple Filter Sidebar component (can be moved to its own file later)
const FilterSidebar: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Categories</h4>
          <div className="space-y-2">
            {['Electronics', 'Clothing', 'Home & Kitchen'].map(category => (
              <div key={category} className="flex items-center">
                <input type="checkbox" id={category} className="mr-2" />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-1/2 p-2 border rounded" 
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className="w-1/2 p-2 border rounded" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Sort Options component
const SortOptions: React.FC<{
  onChange: (value: string) => void;
  value?: string;
}> = ({ onChange, value = 'newest' }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded bg-white dark:bg-gray-800"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
};

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  
  // Create params object for API request
  const params = {
    page: 1,
    limit: 12,
    search: searchQuery,
    sortBy: sortValue.includes('price') ? 'price' : sortValue,
    sortOrder: sortValue === 'price-asc' ? 'asc' as const : 'desc' as const,
  };
  
  // Sample product data for demonstration
  const sampleProducts = Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    name: `Premium Product ${i + 1}`,
    description: "High quality product with premium features",
    price: 99.99 + i * 10,
    discountPrice: i % 3 === 0 ? (99.99 + i * 10) * 0.8 : undefined,
    image: `https://images.unsplash.com/photo-${1560000000000 + i * 1000}?q=80&w=400`,
    category: i % 3 === 0 ? "Electronics" : i % 3 === 1 ? "Clothing" : "Home & Kitchen",
    brand: i % 4 === 0 ? "SoundMaster" : i % 4 === 1 ? "TechVision" : i % 4 === 2 ? "FitTech" : "HomeConnect",
    rating: 3.5 + (i % 5) * 0.3,
    reviews: 10 + i * 5,
    inStock: i % 7 !== 0,
    isNew: i % 5 === 0,
    tags: ["premium", "quality", `tag-${i}`],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  // For demo purposes, we'll use sample data instead of the API
  // const { data, isLoading, error } = useGetProductsQuery(params);
  const isLoading = false;
  const error = null;
  const data = {
    products: sampleProducts,
    total: 48,
    page: 1,
    limit: 12,
    totalPages: 4
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  const handleSortChange = useCallback((value: string) => {
    setSortValue(value);
  }, []);
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        
        {/* Search and Filters UI */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="w-full">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
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
            
            {/* Clear filters button - shown when filters are active */}
            {(searchQuery || sortValue !== 'newest') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSortValue('newest');
                }}
                className="text-sm flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Clear Filters
              </Button>
            )}
            
            {/* Sort options */}
            <div className="ml-auto">
              <SortOptions 
                value={sortValue}
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
                  onClick={() => {
                    setSearchQuery('');
                    setSortValue('newest');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : data?.products && data.products.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try adjusting your filters or search criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSortValue('newest');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results summary */}
                <div className="mb-4 flex items-center justify-between">
                  {data && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {data.products.length} of {data.total || data.products.length} products
                    </p>
                  )}
                </div>
                
                {/* Product grid with product data */}
                {data && data.products && (
                  <ProductGrid 
                    filters={params} 
                    columns={3}
                    limit={12}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductsPage;
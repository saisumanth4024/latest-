import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectFilters, 
  setFilter,
  resetFilters 
} from '../productsSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import MockProductsComponent from '../MockProductsComponent';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const filters = useSelector(selectFilters);
  
  // Sample filter categories for the sidebar
  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing & Apparel' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'beauty', name: 'Beauty & Personal Care' },
    { id: 'books', name: 'Books & Media' },
    { id: 'sports', name: 'Sports & Outdoors' },
    { id: 'toys', name: 'Toys & Games' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'health', name: 'Health & Wellness' },
    { id: 'jewelry', name: 'Jewelry & Watches' }
  ];
  
  // Price ranges for filtering
  const priceRanges = [
    { id: '0-50', name: 'Under $50' },
    { id: '50-100', name: '$50 to $100' },
    { id: '100-200', name: '$100 to $200' },
    { id: '200-500', name: '$200 to $500' },
    { id: '500-1000', name: '$500 to $1000' },
    { id: '1000+', name: 'Over $1000' }
  ];
  
  // Ratings for filtering
  const ratings = [
    { id: '4+', name: '4★ & Above' },
    { id: '3+', name: '3★ & Above' },
    { id: '2+', name: '2★ & Above' },
    { id: '1+', name: '1★ & Above' }
  ];
  
  // Sorting options
  const sortOptions = [
    { id: 'newest', name: 'Newest Arrivals' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' }
  ];
  
  // Handle category filter change
  const handleCategoryChange = (categoryId: string) => {
    dispatch(setFilter({ 
      category: filters.category === categoryId ? null : categoryId 
    }));
  };
  
  // Handle price range filter change
  const handlePriceRangeChange = (priceRangeId: string) => {
    dispatch(setFilter({ 
      priceRange: filters.priceRange === priceRangeId ? null : priceRangeId 
    }));
  };
  
  // Handle rating filter change
  const handleRatingChange = (ratingId: string) => {
    dispatch(setFilter({ 
      rating: filters.rating === ratingId ? null : ratingId 
    }));
  };
  
  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortValue(value);
    dispatch(setFilter({ sort: value }));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setSearchQuery('');
    setSortValue('newest');
  };
  
  // Toggle filter sidebar on mobile
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        
        {/* Search and filter UI */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-full md:w-48">
                <select 
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  value={sortValue}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFilters}
                className="md:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Active filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.category && (
              <Badge variant="secondary" className="px-3 py-1">
                {categories.find(c => c.id === filters.category)?.name}
                <button 
                  className="ml-2"
                  onClick={() => dispatch(setFilter({ category: null }))}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.priceRange && (
              <Badge variant="secondary" className="px-3 py-1">
                {priceRanges.find(p => p.id === filters.priceRange)?.name}
                <button 
                  className="ml-2"
                  onClick={() => dispatch(setFilter({ priceRange: null }))}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.rating && (
              <Badge variant="secondary" className="px-3 py-1">
                {ratings.find(r => r.id === filters.rating)?.name}
                <button 
                  className="ml-2"
                  onClick={() => dispatch(setFilter({ rating: null }))}
                >
                  ×
                </button>
              </Badge>
            )}
            {(filters.category || filters.priceRange || filters.rating || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResetFilters}
                className="h-7 gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filter sidebar (hidden on mobile unless toggled) */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm md:block ${showFilters ? 'block' : 'hidden'}`}>
            <h2 className="font-semibold text-xl mb-4">Filters</h2>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={filters.category === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price ranges */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`price-${range.id}`}
                      checked={filters.priceRange === range.id}
                      onChange={() => handlePriceRangeChange(range.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`price-${range.id}`} className="text-sm cursor-pointer">
                      {range.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ratings */}
            <div>
              <h3 className="font-medium mb-2">Rating</h3>
              <div className="space-y-2">
                {ratings.map(rating => (
                  <div key={rating.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating.id}`}
                      checked={filters.rating === rating.id}
                      onChange={() => handleRatingChange(rating.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating.id}`} className="text-sm cursor-pointer">
                      {rating.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product listing */}
          <div className="md:col-span-3">
            <MockProductsComponent 
              title=""
              count={16} 
              columns={3}
              filters={{
                category: filters.category,
                priceRange: filters.priceRange,
                rating: filters.rating,
                sort: sortValue
              }}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductsPage;
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectFilters, 
  setFilter,
  resetFilters,
  ProductFilters 
} from '../productsSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import SimpleProductGrid from './SimpleProductGrid';
import FilterSidebar from './FilterSidebar';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const filters = useSelector(selectFilters);
  
  // Sample filter categories for the sidebar
  const categories = [
    'Electronics',
    'Clothing & Apparel',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books & Media',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Health & Wellness',
    'Jewelry & Watches'
  ];
  
  // Brands for filtering
  const brands = [
    'Apple',
    'Samsung',
    'Sony',
    'Nike',
    'Adidas',
    'LG',
    'Dell',
    'HP',
    'Lenovo',
    'Bose',
    'Canon',
    'Dyson',
    'KitchenAid',
    'Philips',
    'Levi\'s',
    'Under Armour'
  ];
  
  // Colors for filtering
  const colors = [
    'Black',
    'White',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Pink',
    'Brown',
    'Orange',
    'Silver',
    'Gold'
  ];
  
  // Tags for filtering
  const tags = [
    'Wireless',
    'Bluetooth',
    'Waterproof',
    'Portable',
    'Smart Home',
    'Eco-Friendly',
    'Limited Edition',
    'High Performance',
    'Noise Cancelling',
    'Fast Charging',
    'Handmade',
    'Premium',
    'Compact',
    'Lightweight',
    'Organic',
    'Sustainable',
    'Bestseller'
  ];
  
  // Sorting options
  const sortOptions = [
    { id: 'newest', name: 'Newest Arrivals' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'discount', name: 'Best Discount' }
  ];
  
  // Handle filter updates
  const handleUpdateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    // Loop through each filter property and update
    Object.entries(newFilters).forEach(([key, value]) => {
      dispatch(setFilter({ 
        key: key as keyof ProductFilters, 
        value 
      }));
    });
  }, [dispatch]);
  
  // Handle clearing a specific filter
  const handleClearFilter = useCallback((key: keyof ProductFilters) => {
    let value: any = null;
    
    // For array filters, set to empty array instead of null
    if (key === 'brand' || key === 'colors' || key === 'tags') {
      value = null;
    }
    
    dispatch(setFilter({ key, value }));
  }, [dispatch]);
  
  // Handle search query change
  const handleSearchChange = (query: string) => {
    console.log('Setting search query to:', query);
    setSearchQuery(query);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortValue(value);
    dispatch(setFilter({ key: 'sort', value }));
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
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search products by name, category, or brand..."
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 pl-9 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchQuery('');
                      handleSearchChange('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
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
                Category: {filters.category}
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('category')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.priceRange && (
              <Badge variant="secondary" className="px-3 py-1">
                Price: ${filters.priceRange}
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('priceRange')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.minRating && (
              <Badge variant="secondary" className="px-3 py-1">
                Rating: {filters.minRating}+ stars
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('minRating')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.brand && filters.brand.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                Brands: {filters.brand.length} selected
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('brand')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.colors && filters.colors.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                Colors: {filters.colors.length} selected
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('colors')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.tags && filters.tags.length > 0 && (
              <Badge variant="secondary" className="px-3 py-1">
                Tags: {filters.tags.length} selected
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('tags')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.discount && (
              <Badge variant="secondary" className="px-3 py-1">
                On Sale
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('discount')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.inStock && (
              <Badge variant="secondary" className="px-3 py-1">
                In Stock Only
                <button 
                  className="ml-2"
                  onClick={() => handleClearFilter('inStock')}
                >
                  ×
                </button>
              </Badge>
            )}
            {(filters.category || filters.priceRange || filters.minRating || 
              filters.brand || filters.colors || filters.tags || 
              filters.discount || filters.inStock || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResetFilters}
                className="h-7 gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Reset All
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filter sidebar for desktop */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <FilterSidebar 
              categories={categories}
              brands={brands}
              colors={colors}
              tags={tags}
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onClose={() => {}}
            />
          </div>
          
          {/* Mobile filter sidebar using Sheet component */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="md:hidden fixed bottom-4 right-4 z-10 shadow-lg"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <FilterSidebar 
                categories={categories}
                brands={brands}
                colors={colors}
                tags={tags}
                filters={filters}
                onUpdateFilters={handleUpdateFilters}
                onClose={() => setShowFilters(false)}
              />
            </SheetContent>
          </Sheet>
          
          {/* Product listing */}
          <div className="md:col-span-3">
            {/* Using the simpler product grid that works offline */}
            <SimpleProductGrid 
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductsPage;
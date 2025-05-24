import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, ArrowLeft } from 'lucide-react';
import MockProductsComponent from '../../products/MockProductsComponent';

// Type definition for the filters
interface SelectedFilters {
  category: string | null;
  price: string | null;
  rating: string | null;
  sort: string;
}

const SearchResults: React.FC = () => {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Parse the search query from the URL
  useEffect(() => {
    const query = new URLSearchParams(location.split('?')[1] || '');
    const q = query.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);
  
  // Sorting options
  const sortOptions = [
    { id: 'relevance', name: 'Relevance' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' }
  ];
  
  // Mock filters for UI
  const filters = {
    categories: [
      { id: 'electronics', name: 'Electronics', count: 124 },
      { id: 'clothing', name: 'Clothing', count: 89 },
      { id: 'home', name: 'Home & Kitchen', count: 56 },
      { id: 'beauty', name: 'Beauty', count: 43 },
      { id: 'books', name: 'Books', count: 21 }
    ],
    price: [
      { id: 'under-25', name: 'Under $25', count: 87 },
      { id: '25-50', name: '$25 to $50', count: 129 },
      { id: '50-100', name: '$50 to $100', count: 93 },
      { id: '100-200', name: '$100 to $200', count: 42 },
      { id: 'over-200', name: 'Over $200', count: 12 }
    ],
    rating: [
      { id: '4-up', name: '4★ & Up', count: 183 },
      { id: '3-up', name: '3★ & Up', count: 267 },
      { id: '2-up', name: '2★ & Up', count: 312 },
      { id: '1-up', name: '1★ & Up', count: 363 }
    ]
  };
  
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: null,
    price: null,
    rating: null,
    sort: 'relevance'
  });
  
  // Handler for going back
  const handleBack = () => {
    setLocation('/');
  };
  
  // Toggle filter sidebar on mobile
  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };
  
  // Handle filter changes
  const handleFilterChange = (type: keyof SelectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };
  
  // Handle sort changes
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilters(prev => ({
      ...prev,
      sort: e.target.value
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      category: null,
      price: null,
      rating: null,
      sort: 'relevance'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with back button and search info */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">
            Search Results for "{searchQuery}"
          </h1>
          
          <div className="flex items-center gap-2">
            <select
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              value={selectedFilters.sort}
              onChange={handleSortChange}
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={toggleFilter}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Active filters */}
        {(selectedFilters.category || selectedFilters.price || selectedFilters.rating) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedFilters.category && (
              <Badge variant="secondary" className="px-3 py-1">
                Category: {filters.categories.find(c => c.id === selectedFilters.category)?.name}
                <button 
                  className="ml-2" 
                  onClick={() => handleFilterChange('category', selectedFilters.category)}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {selectedFilters.price && (
              <Badge variant="secondary" className="px-3 py-1">
                Price: {filters.price.find(p => p.id === selectedFilters.price)?.name}
                <button 
                  className="ml-2" 
                  onClick={() => handleFilterChange('price', selectedFilters.price)}
                >
                  ×
                </button>
              </Badge>
            )}
            
            {selectedFilters.rating && (
              <Badge variant="secondary" className="px-3 py-1">
                Rating: {filters.rating.find(r => r.id === selectedFilters.rating)?.name}
                <button 
                  className="ml-2" 
                  onClick={() => handleFilterChange('rating', selectedFilters.rating)}
                >
                  ×
                </button>
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-7"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
      
      {/* Main content area with filters and results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm`}>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {filters.categories.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedFilters.category === category.id}
                      onChange={() => handleFilterChange('category', category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({category.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price</h3>
            <div className="space-y-2">
              {filters.price.map(price => (
                <div key={price.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`price-${price.id}`}
                      checked={selectedFilters.price === price.id}
                      onChange={() => handleFilterChange('price', price.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`price-${price.id}`} className="text-sm">
                      {price.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({price.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              {filters.rating.map(rating => (
                <div key={rating.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${rating.id}`}
                      checked={selectedFilters.rating === rating.id}
                      onChange={() => handleFilterChange('rating', rating.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`rating-${rating.id}`} className="text-sm">
                      {rating.name}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({rating.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Search results */}
        <div className="md:col-span-3">
          <MockProductsComponent 
            title=""
            count={12} 
            columns={3}
            filters={{
              category: selectedFilters.category,
              priceRange: selectedFilters.price,
              rating: selectedFilters.rating,
              sort: selectedFilters.sort
            }}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
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
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, SlidersHorizontal, Star, ShoppingCart, Heart } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Sample product data with realistic names and working images
const productNames = [
  "Ultra Wireless Headphones",
  "Premium Running Shoes",
  "Smart Watch Pro",
  "Designer Sunglasses",
  "Wireless Earbuds",
  "Ultrabook Laptop 15\"",
  "Mechanical Keyboard",
  "Noise-Cancelling Headset",
  "Performance Athletic Shoes",
  "Ergonomic Office Chair",
  "Modern LED Desk Lamp",
  "Sectional Sofa"
];

const productImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", // Headphones
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", // Red shoes
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", // Watch
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", // Sunglasses
  "https://images.unsplash.com/photo-1600086827875-a63b01f1335c?w=400&q=80", // Earbuds
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", // Laptop
  "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80", // Keyboard
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", // Headset
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80", // Shoes
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80", // Chair
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", // Lamp
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"  // Sofa
];

const descriptions = [
  "Experience premium sound quality with deep bass and noise isolation",
  "Engineered for comfort and performance with breathable materials",
  "Track your fitness goals and stay connected with smart notifications",
  "Polarized lenses with UV protection in a stylish, durable frame",
  "Crystal clear audio with 30-hour battery life and water resistance",
  "Ultra-fast performance with 16GB RAM and 512GB SSD storage",
  "Precision typing experience with customizable RGB lighting",
  "Block out distractions with advanced noise cancellation technology",
  "Maximum comfort and support for high-intensity training",
  "Adjustable lumbar support and breathable mesh for all-day comfort",
  "Adjustable brightness with multiple color temperatures",
  "Premium fabric with modular design for flexible arrangements"
];

const sampleProducts = Array(12).fill(0).map((_, i) => ({
  id: i + 1,
  name: productNames[i],
  description: descriptions[i],
  price: (79 + (i * 30)) + 0.99,
  discountPrice: i % 3 === 0 ? ((79 + (i * 30)) + 0.99) * 0.8 : undefined,
  image: productImages[i],
  category: i % 3 === 0 ? "Electronics" : i % 3 === 1 ? "Clothing" : "Home & Kitchen",
  brand: i % 4 === 0 ? "SoundMaster" : i % 4 === 1 ? "TechVision" : i % 4 === 2 ? "FitTech" : "HomeConnect",
  rating: (Math.floor((3 + Math.random() * 2) * 10) / 10).toFixed(1),
  reviews: Math.floor(10 + Math.random() * 490),
  inStock: i % 7 !== 0,
  isNew: i % 5 === 0,
  tags: ["premium", i % 3 === 0 ? "electronics" : i % 3 === 1 ? "clothing" : "home", `${i % 2 === 0 ? "featured" : "bestseller"}`],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

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
                
                {/* Product grid with sample data */}
                <ProductGrid 
                  filters={filters}
                  columns={3}
                  limit={12}
                />
                
                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={params.page <= 1}
                    >
                      Previous
                    </Button>
                    
                    {[1, 2, 3, 4].map((page) => (
                      <Button
                        key={page}
                        variant={params.page === page ? "default" : "outline"}
                        size="sm"
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={params.page >= data.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductsPage;
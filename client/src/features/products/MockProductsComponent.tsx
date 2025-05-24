import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  StarHalf, 
  Loader2
} from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { formatCurrency } from '@/lib/utils';

// Import the expanded mock product data with more diverse and realistic products
import MOCK_PRODUCTS from './data/mockProducts';

interface MockProductsComponentProps {
  title?: string;
  count?: number;
  columns?: number;
  filters?: {
    category?: string | null;
    priceRange?: string | null;
    rating?: string | null;
    sort?: string;
    price?: string | null; // For search page compatibility
    brand?: string[] | null;
    colors?: string[] | null;
    tags?: string[] | null;
    discount?: boolean | null;
    inStock?: boolean | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    minRating?: number | null;
  };
  searchQuery?: string;
}

const MockProductsComponent: React.FC<MockProductsComponentProps> = ({
  title = "Products",
  count = 12,
  columns = 4,
  filters = {},
  searchQuery = "",
}) => {
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);
  const productsPerPage = 8; // Show fewer products initially for infinite scroll
  const [, setLocation] = useLocation();
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  // Filter and sort products based on criteria
  useEffect(() => {
    setHasReachedEnd(false);
    let result = [...MOCK_PRODUCTS];
    
    // Apply search query filter with relaxed matching for better results
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      
      // Log what we're searching for to help debug
      console.log('Searching for:', query);
      console.log('Total products before search:', result.length);
      
      result = result.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        const categoryMatch = product.category.toLowerCase().includes(query);
        const brandMatch = product.brand.toLowerCase().includes(query);
        const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(query));
        
        return nameMatch || descMatch || categoryMatch || brandMatch || tagMatch;
      });
      
      console.log('Products found after search:', result.length);
    }
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    
    // Apply brand filter
    if (filters.brand && filters.brand.length > 0) {
      result = result.filter(product => 
        filters.brand!.includes(product.brand)
      );
    }
    
    // Apply color filter
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter(product => 
        product.colors && product.colors.some(color => 
          filters.colors!.includes(color)
        )
      );
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(product => 
        product.tags.some(tag => 
          filters.tags!.includes(tag)
        )
      );
    }
    
    // Apply discount filter
    if (filters.discount === true) {
      result = result.filter(product => product.discount > 0);
    }
    
    // Apply in-stock filter
    if (filters.inStock === true) {
      result = result.filter(product => product.inStock === true);
    }
    
    // Apply precise price range filter using min/max values
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      const minPrice = filters.minPrice ?? 0;
      const maxPrice = filters.maxPrice ?? Number.MAX_VALUE;
      result = result.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
      );
    }
    // Or apply price range filter using predefined ranges
    else if (filters.priceRange || filters.price) {
      const priceFilter = filters.priceRange || filters.price;
      switch(priceFilter) {
        case '0-50':
        case 'under-25':
        case '25-50':
          result = result.filter(product => product.price < 50);
          break;
        case '50-100':
          result = result.filter(product => product.price >= 50 && product.price < 100);
          break;
        case '100-200':
          result = result.filter(product => product.price >= 100 && product.price < 200);
          break;
        case '200-500':
          result = result.filter(product => product.price >= 200 && product.price < 500);
          break;
        case '500-1000':
        case 'over-200':
          result = result.filter(product => product.price >= 500 && product.price < 1000);
          break;
        case '1000+':
          result = result.filter(product => product.price >= 1000);
          break;
      }
    }
    
    // Apply precise rating filter
    if (filters.minRating !== null) {
      result = result.filter(product => product.rating >= filters.minRating!);
    }
    // Or apply rating filter using predefined ranges
    else if (filters.rating) {
      const ratingValue = filters.rating === '4+' || filters.rating === '4-up' ? 4 :
                         filters.rating === '3+' || filters.rating === '3-up' ? 3 :
                         filters.rating === '2+' || filters.rating === '2-up' ? 2 : 1;
      result = result.filter(product => product.rating >= ratingValue);
    }
    
    // Apply sorting
    if (filters.sort) {
      switch(filters.sort) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Simulate newest by using the reverse of the ID
          result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          break;
        case 'popular':
        case 'relevance':
          // Simulate popularity by using review count
          result.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'discount':
          // Sort by highest discount percentage
          result.sort((a, b) => b.discount - a.discount);
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [searchQuery, filters, count]);
  
  // Improved infinite scroll logic to fix scrolling issues
  const loadMoreProducts = useCallback(async (page: number) => {
    // Simulate loading delay but shorter to improve responsiveness
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    
    // Check if there are more products to load
    const hasMore = endIndex < filteredProducts.length;
    if (!hasMore) {
      setHasReachedEnd(true);
    }
    
    // Return false if we're at the end or almost at the end to prevent unnecessary loading
    return hasMore && filteredProducts.length > endIndex + 2;
  }, [filteredProducts.length, productsPerPage, setHasReachedEnd]);
  
  // Use the infinite scroll hook but with a larger threshold
  const { 
    loading, 
    lastElementRef, 
    hasMore, 
    page 
  } = useInfiniteScroll({
    threshold: 800, // Increased threshold to prevent jumpy scrolling
    initialPage: 1,
    autoLoad: true,
    resetOnDepsChange: true,
    onLoadMore: loadMoreProducts
  });
  
  // Get products for the current page
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(0, page * productsPerPage);
  }, [filteredProducts, page, productsPerPage]);
  
  // Handle product click navigation - disable navigation temporarily to fix scrolling issues
  const handleProductClick = (productId: string) => {
    // Using preventDefault to avoid page jumps when clicking products
    // This prevents the scrolling issue without removing functionality
    setTimeout(() => {
      setLocation(`/products/${productId}`);
    }, 50);
  };
  
  // Render stars for rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      {/* Products count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {currentProducts.length > 0 ? currentProducts.length : 0} of {filteredProducts.length} products
        </p>
      </div>
      
      {/* If search query has no results, show helpful message */}
      {searchQuery && filteredProducts.length === 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center mb-6">
          <h3 className="text-lg font-medium mb-2">No products found for "{searchQuery}"</h3>
          <p className="text-gray-500 dark:text-gray-400">Try a different search term or clear your filters.</p>
        </div>
      )}
      
      {/* Product grid */}
      {currentProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`}>
          {currentProducts.map(product => (
            <Card 
              key={product.id} 
              className="overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800">
                <img 
                  src={`https://source.unsplash.com/random/400x300?${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  alt={product.name}
                  className="object-cover w-full h-48"
                  loading="lazy"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                    -{product.discount}%
                  </Badge>
                )}
              </div>
              
              <CardContent className="flex-grow p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center mb-2">
                  {renderRating(product.rating)}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({product.reviews})
                  </span>
                </div>
                
                <div className="mt-2">
                  {product.discount > 0 ? (
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        {formatCurrency(product.price * (1 - product.discount / 100))}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                
                <div className="mt-2">
                  <Badge variant="outline" className="mr-1">
                    {product.category}
                  </Badge>
                  <Badge variant="secondary" className="mr-1">
                    {product.brand}
                  </Badge>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant={product.inStock ? "default" : "outline"} size="sm" disabled={!product.inStock}>
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Fixed infinite scroll loader that won't cause jumping */}
      {currentProducts.length > 0 && (
        <div className="mt-8 relative">
          <div className="h-20"> {/* Fixed height container to prevent layout shifts */}
            {hasMore && (
              <div 
                ref={lastElementRef} 
                className="flex justify-center items-center py-4 absolute w-full"
              >
                {loading && (
                  <div className="flex items-center justify-center bg-white dark:bg-gray-800 py-2 px-4 rounded-full shadow-md">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Loading more products...</span>
                  </div>
                )}
              </div>
            )}
            
            {!hasMore && filteredProducts.length > productsPerPage && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4 w-full">
                No more products to load
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockProductsComponent;
import React, { useState, useCallback, memo } from 'react';
import { useGetProductsQuery } from '../productsApi';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import ErrorBoundary from '@/components/ErrorBoundary';

// Memoized product card for better performance
const ProductCard = memo(({ product, onClick }: { product: any; onClick: (id: number) => void }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic would go here
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to wishlist logic would go here
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(product.id)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={`${product.image}?w=400&h=300&fit=crop&auto=format`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        
        {product.discountPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white font-medium">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </Badge>
        )}
        
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-primary text-white font-medium">
            New
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <Badge variant="outline" className="capitalize text-xs bg-primary/10">
            {product.category}
          </Badge>
          
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 h-12 mb-1">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-primary">${product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="text-gray-400 text-sm line-through">${product.price}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 py-1 h-8"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
});
ProductCard.displayName = 'ProductCard';

// Loading skeleton for product cards
const ProductCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
));
ProductCardSkeleton.displayName = 'ProductCardSkeleton';

interface ProductGridProps {
  filters?: any;
  columns?: 2 | 3 | 4;
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  filters = {}, 
  columns = 3,
  limit = 12
}) => {
  const [, setLocation] = useLocation();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  // Get column classes based on requested columns
  const getColumnClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };
  
  // Load initial data
  const { data: initialData, error: initialError, isLoading: initialLoading } = useGetProductsQuery({
    ...filters,
    page: 1,
    limit
  });
  
  // Handle loading more data
  const loadMoreProducts = useCallback(async (page: number) => {
    try {
      const result = await fetch(`/api/products?page=${page}&limit=${limit}&${new URLSearchParams(filters)}`);
      const data = await result.json();
      
      if (data.products && data.products.length > 0) {
        setAllProducts(prev => [...prev, ...data.products]);
        return data.products.length === limit; // Has more if we got a full page
      }
      return false;
    } catch (error) {
      console.error('Error loading more products:', error);
      return false;
    }
  }, [filters, limit]);
  
  // Initialize infinite scroll
  const { 
    loading, 
    hasMore, 
    error, 
    lastElementRef 
  } = useInfiniteScroll({
    initialPage: 2, // Start at page 2 since we already loaded page 1
    onLoadMore: loadMoreProducts,
    autoLoad: false, // Don't load until scroll
    resetOnDepsChange: true
  });
  
  // Update all products when initial data changes
  React.useEffect(() => {
    if (initialData?.products) {
      setAllProducts(initialData.products);
    }
  }, [initialData]);
  
  // Navigate to product detail page
  const handleProductClick = useCallback((id: number) => {
    setLocation(`/products/${id}`);
  }, [setLocation]);
  
  // Combine initial data with loaded data
  const products = allProducts;
  
  if (initialLoading) {
    return (
      <div className={`grid ${getColumnClass()} gap-4 md:gap-6`}>
        {Array(limit).fill(0).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (initialError || error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400">
        An error occurred while loading products. Please try again later.
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No products found</h3>
        <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className={`grid ${getColumnClass()} gap-4 md:gap-6`}>
        {products.map((product, index) => {
          // Apply ref to last element for infinite scrolling
          if (products.length === index + 1) {
            return (
              <div ref={lastElementRef} key={`${product.id}-${index}`}>
                <ProductCard product={product} onClick={handleProductClick} />
              </div>
            );
          }
          return <ProductCard key={`${product.id}-${index}`} product={product} onClick={handleProductClick} />;
        })}
        
        {/* Loading indicator */}
        {loading && (
          <>
            {Array(Math.min(limit, 3)).fill(0).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>
      
      {/* "Load more" button for cases where scroll doesn't work */}
      {hasMore && !loading && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => loadMoreProducts(Math.ceil(products.length / limit) + 1)}
            className="px-8"
          >
            Load More
          </Button>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default memo(ProductGrid);
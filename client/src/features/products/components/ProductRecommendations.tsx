import React from 'react';
import { Link } from '@/router/wouterCompat';
import { Product } from '../productsApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectProduct, selectRecentlyViewedIds } from '../productsSlice';
import { useGetProductsQuery } from '../productsApi';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductRecommendationsProps {
  products: Product[];
  currentProductId: number;
  title?: string;
  type?: 'similar' | 'frequently-bought' | 'recently-viewed';
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  products,
  currentProductId,
  title = 'Recommended Products',
  type = 'similar'
}) => {
  const dispatch = useDispatch();
  const recentlyViewedIds = useSelector(selectRecentlyViewedIds);
  
  // Fetch recently viewed products if needed
  const { data: recentlyViewedData } = useGetProductsQuery({ 
    // Use the IDs from Redux state, except the current product
    ids: recentlyViewedIds.filter(id => id !== currentProductId) 
  }, { 
    // Only run this query if we're in recently-viewed mode and have IDs
    skip: type !== 'recently-viewed' || recentlyViewedIds.length === 0 
  });
  
  // Select which products to show
  const displayProducts = type === 'recently-viewed' 
    ? (recentlyViewedData?.products || []) 
    : products;
  
  // Limit to 4 products
  const limitedProducts = displayProducts.slice(0, 4);
  
  // Handle product click (to track in Redux)
  const handleProductClick = (productId: number) => {
    dispatch(selectProduct(productId));
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // If no products to display, don't render the component
  if (limitedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {limitedProducts.map((product) => (
          <Card key={product.id} className="h-full flex flex-col overflow-hidden">
            <Link 
              href={`/products/${product.id}`} 
              onClick={() => handleProductClick(product.id)}
              className="group"
            >
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                {product.isNew && (
                  <Badge 
                    variant="default" 
                    className="absolute top-2 left-2 text-xs"
                  >
                    New
                  </Badge>
                )}
                {product.discountPrice && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-2 right-2 text-xs"
                  >
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              <CardContent className="flex-grow pt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                <h4 className="font-medium line-clamp-2 text-sm mt-1 group-hover:text-primary transition-colors">{product.name}</h4>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                      {product.rating.toFixed(1)} ({product.reviewCount})
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  {product.discountPrice ? (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{formatPrice(product.discountPrice)}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                  )}
                </div>
              </CardContent>
            </Link>
            
            <CardFooter className="p-3 pt-0 mt-auto">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'wouter';
import { Product } from '../productsApi';
import { selectProduct } from '../productsSlice';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const dispatch = useDispatch();

  const handleProductClick = (productId: number) => {
    dispatch(selectProduct(productId));
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Render stars for ratings
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <span className="absolute inset-0 overflow-hidden w-[50%]">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
          key={product.id} 
          href={`/products/${product.id}`}
          onClick={() => handleProductClick(product.id)}
        >
          <Card className="h-full flex flex-col cursor-pointer transition-all duration-200 hover:shadow-md">
            <div className="relative pt-[75%] overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              
              {/* Badges for new or featured products */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge variant="default" className="text-xs">New</Badge>
                )}
                {product.isFeatured && (
                  <Badge variant="secondary" className="text-xs">Featured</Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                )}
              </div>
              
              {/* Discount badge if applicable */}
              {product.discountPrice && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-2 right-2 font-semibold"
                >
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </Badge>
              )}
            </div>
            
            <CardHeader className="pb-2 pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</div>
              <h3 className="text-base font-semibold line-clamp-2 mt-1">{product.name}</h3>
            </CardHeader>
            
            <CardContent className="pb-2 pt-0 flex-grow">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {product.description}
              </p>
              
              {/* Rating display */}
              <div className="flex items-center mt-3">
                <div className="flex items-center mr-2">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.reviewCount})
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-baseline gap-1">
                  {product.discountPrice ? (
                    <>
                      <span className="font-bold text-lg">{formatPrice(product.discountPrice)}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                  )}
                </div>
                
                {/* Available colors if any */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex -space-x-1">
                    {product.colors.slice(0, 3).map((color, i) => (
                      <div 
                        key={i}
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                        style={{ backgroundColor: color === 'rgb' 
                          ? 'linear-gradient(135deg, #ff0000, #00ff00, #0000ff)' 
                          : color 
                        }}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-center flex items-center justify-center text-[8px]">
                        +{product.colors.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
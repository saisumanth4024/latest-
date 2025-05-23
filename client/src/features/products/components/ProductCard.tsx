import { useState } from 'react';
import { Link } from 'wouter';
import { Product } from '../types';
import { cn, formatNumber } from '@/lib/utils';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  ShoppingBag, 
  Badge, 
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useAppDispatch } from '@/app/hooks';
import { addViewedProduct } from '../productsSlice';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  view?: 'grid' | 'list';
  className?: string;
}

const ProductCard = ({ 
  product, 
  size = 'md', 
  view = 'grid', 
  className 
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const {
    id,
    name,
    description,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    images,
    thumbnail,
    category,
    brand,
    inStock,
    bestSeller,
    newArrival,
    featured
  } = product;

  // Calculate discount percentage if not provided
  const discount = discountPercentage || (originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0);

  // Handle product click to track viewed products
  const handleProductClick = () => {
    dispatch(addViewedProduct({
      id,
      name,
      price,
      thumbnail,
      category,
      brand,
      viewedAt: new Date().toISOString()
    }));
  };

  // Determine if we should use list or grid view
  const isList = view === 'list';

  return (
    <div 
      className={cn(
        'group relative rounded-lg transition-all duration-300 overflow-hidden',
        'border dark:border-gray-800 hover:shadow-md',
        isList ? 'flex' : 'flex flex-col',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div 
        className={cn(
          'relative overflow-hidden',
          isList ? 'w-1/4' : 'w-full aspect-square',
          size === 'sm' && !isList && 'h-40',
          size === 'md' && !isList && 'h-48',
          size === 'lg' && !isList && 'h-64'
        )}
      >
        <Link to={`/products/${id}`} onClick={handleProductClick}>
          <img
            src={thumbnail}
            alt={name}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
          />
        </Link>

        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
          {bestSeller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
              <BadgeCheck className="w-3 h-3 mr-1" />
              BEST SELLER
            </span>
          )}
          {newArrival && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {!inStock && (
            <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className={cn(
          'absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
            aria-label="Add to cart"
            disabled={!inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className={cn(
        'flex flex-col p-3',
        isList ? 'w-3/4' : 'w-full'
      )}>
        <div className="flex justify-between items-start">
          <div className="text-sm text-gray-600 dark:text-gray-400">{brand}</div>
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
            <span className="text-sm">{rating}</span>
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <Link to={`/products/${id}`} onClick={handleProductClick}>
          <h3 className={cn(
            'font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2 mt-1',
            size === 'sm' ? 'text-sm' : 'text-base'
          )}>
            {name}
          </h3>
        </Link>
        
        {isList && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {description}
          </p>
        )}
        
        <div className="flex items-center mt-2">
          <span className="font-bold text-gray-900 dark:text-white">
            ${formatNumber(price)}
          </span>
          
          {originalPrice && originalPrice > price && (
            <span className="text-gray-500 line-through ml-2 text-sm">
              ${formatNumber(originalPrice)}
            </span>
          )}
        </div>
        
        {isList && (
          <div className="mt-3">
            <Button 
              className="w-full sm:w-auto"
              disabled={!inStock}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        )}
        
        {!isList && inStock && (
          <Button 
            variant="ghost" 
            className="mt-2 w-full justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
        
        {!isList && !inStock && (
          <Button 
            variant="ghost" 
            className="mt-2 w-full justify-center opacity-60 cursor-not-allowed"
            disabled
          >
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
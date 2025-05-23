import { useAppDispatch } from '@/app/hooks';
import { Product } from '../types';
import { 
  Card, 
  CardContent,
  CardFooter,
  Badge,
  Button 
} from '@/components/ui';
import { 
  ShoppingCart,
  Heart,
  Star,
  Bookmark,
  Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  layoutMode?: 'grid' | 'list';
}

const ProductCard = ({ product, className, layoutMode = 'grid' }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  
  // Determine if the card is in grid or list mode
  const isList = layoutMode === 'list';
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  // Truncate long product names
  const truncatedName = isList
    ? product.name
    : product.name.length > 60
      ? `${product.name.substring(0, 57)}...`
      : product.name;
  
  // Handle add to cart
  const handleAddToCart = () => {
    // Dispatch add to cart action (to be implemented)
    console.log('Add to cart:', product.id);
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = () => {
    // Dispatch add to wishlist action (to be implemented)
    console.log('Add to wishlist:', product.id);
  };
  
  // Handle quick view
  const handleQuickView = () => {
    // Dispatch open product modal action (to be implemented)
    console.log('Quick view:', product.id);
  };
  
  // Render stars for product rating
  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              "h-4 w-4",
              index < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : index === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400 mask-star-half"
                  : "text-gray-300"
            )}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
          ({product.reviewCount})
        </span>
      </div>
    );
  };
  
  if (isList) {
    // List view version of the card
    return (
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
        <div className="flex flex-col sm:flex-row">
          {/* Product image */}
          <div className="w-full sm:w-1/4 relative bg-gray-100 dark:bg-gray-800">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain w-full h-48 sm:h-full"
            />
            
            {/* Discount badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-600">
                {discountPercentage}% OFF
              </Badge>
            )}
            
            {/* New badge */}
            {product.isNew && (
              <Badge 
                className="absolute top-2 right-2 bg-blue-600"
                variant="secondary"
              >
                NEW
              </Badge>
            )}
          </div>
          
          {/* Product details */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              {/* Brand */}
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {product.brand}
              </div>
              
              {/* Product name */}
              <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {truncatedName}
              </h3>
              
              {/* Rating */}
              <div className="mb-2">
                {renderStars()}
              </div>
              
              {/* Price */}
              <div className="flex items-center mb-3">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${formatNumber(product.price)}
                </span>
                
                {discountPercentage > 0 && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                    ${formatNumber(product.originalPrice || 0)}
                  </span>
                )}
              </div>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
                className="h-9 w-9"
              >
                <Heart className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuickView}
                className="h-9 w-9"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Grid view version of the card
  return (
    <Card className={cn("overflow-hidden h-full hover:shadow-md transition-shadow", className)}>
      {/* Product image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-contain w-full h-full"
        />
        
        {/* Discount badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-600">
            {discountPercentage}% OFF
          </Badge>
        )}
        
        {/* New badge */}
        {product.isNew && (
          <Badge 
            className="absolute top-2 right-2 bg-blue-600"
            variant="secondary"
          >
            NEW
          </Badge>
        )}
        
        {/* Quick actions */}
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-1 p-2 bg-black/40 backdrop-blur-sm group-hover:bottom-0 transition-all opacity-0 group-hover:opacity-100">
          <Button
            variant="outline"
            size="icon"
            onClick={handleQuickView}
            className="h-8 w-8 bg-white text-black hover:bg-gray-100 hover:text-black"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddToWishlist}
            className="h-8 w-8 bg-white text-black hover:bg-gray-100 hover:text-black"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddToCart}
            className="h-8 w-8 bg-white text-black hover:bg-gray-100 hover:text-black"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3">
        {/* Brand */}
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {product.brand}
        </div>
        
        {/* Product name */}
        <h3 className="text-sm font-medium mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
          {truncatedName}
        </h3>
        
        {/* Rating */}
        <div className="mb-2">
          {renderStars()}
        </div>
        
        {/* Price */}
        <div className="flex items-center">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ${formatNumber(product.price)}
          </span>
          
          {discountPercentage > 0 && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
              ${formatNumber(product.originalPrice || 0)}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
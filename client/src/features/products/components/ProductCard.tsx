import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
    category: string;
    brand: string;
    rating: number | string;
    reviews: number;
    inStock: boolean;
    isNew: boolean;
    tags: string[];
  };
  onClick?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src =
              "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
          }}
        />
        
        {product.discountPrice && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white font-medium">
            {Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)}% OFF
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
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Heart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
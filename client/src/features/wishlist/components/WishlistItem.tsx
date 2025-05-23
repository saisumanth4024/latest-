import React from 'react';
import { useAppDispatch } from '@/app/hooks';
import { 
  removeFromWishlist,
  moveToCart
} from '../wishlistSlice';
import { addToCart } from '@/features/cart/cartSlice';
import { WishlistItem as WishlistItemType } from '../wishlistSlice';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WishlistItemProps {
  item: WishlistItemType;
  wishlistId: string;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, wishlistId }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Handle removing from wishlist
  const handleRemove = () => {
    dispatch(removeFromWishlist({
      wishlistId,
      itemId: item.id
    }));
    
    toast({
      title: 'Item removed',
      description: `Item has been removed from your wishlist.`,
      variant: 'default',
    });
  };

  // Handle moving to cart
  const handleMoveToCart = () => {
    // Only move to cart if we have the required information
    if (item.product && item.product.price !== undefined) {
      // Add to cart
      dispatch(addToCart({
        productId: item.productId,
        variantId: item.variantId,
        product: item.product,
        variant: item.variant,
        quantity: 1,
        unitPrice: item.product.price,
        discountTotal: 0,
        sku: item.product.sku || 'SKU-' + item.productId,
        isDigital: item.product.isDigital || false,
        requiresShipping: item.product.requiresShipping !== false,
        isTaxExempt: false
      }));
      
      // Remove from wishlist
      dispatch(removeFromWishlist({
        wishlistId,
        itemId: item.id
      }));
      
      toast({
        title: 'Added to cart',
        description: `Item has been moved to your cart.`,
        variant: 'success',
      });
    } else {
      toast({
        title: 'Unable to add to cart',
        description: 'This item cannot be added to your cart.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center border-b last:border-b-0 pb-4 last:pb-0">
      {/* Product Image & Info */}
      <div className="flex items-center flex-1">
        <div className="w-16 h-16 rounded-md border overflow-hidden flex-shrink-0">
          <img 
            src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
            alt={item.product?.name || 'Product'} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
          <div className="text-sm text-muted-foreground">
            {item.variant && (
              <span className="mr-2">
                {Object.entries(item.variant)
                  .filter(([key]) => !['id', 'productId'].includes(key))
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </span>
            )}
            {item.product?.price !== undefined && (
              <div className="font-medium mt-1">${item.product.price.toFixed(2)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleMoveToCart} 
          disabled={item.product?.price === undefined}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleRemove}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default WishlistItem;
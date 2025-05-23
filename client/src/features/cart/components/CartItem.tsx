import React, { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { 
  updateCartItemQuantity,
  removeFromCart,
  moveToWishlist
} from '../cartSlice';
import { addToWishlist } from '@/features/wishlist/wishlistSlice';
import { CartItem as CartItemType } from '@/types/cart';
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Heart, 
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CartItemProps {
  item: CartItemType;
  wishlistId?: string;
}

const CartItem: React.FC<CartItemProps> = ({ item, wishlistId }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Handle quantity change
  const handleQuantityChange = async (change: number) => {
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast({
        title: 'Maximum quantity reached',
        description: 'You cannot add more than 10 units of this item.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await dispatch(updateCartItemQuantity({
        itemId: item.id,
        quantity: newQuantity
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quantity. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle remove from cart
  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast({
      title: 'Item removed',
      description: 'Item has been removed from your cart.',
      variant: 'default',
    });
  };

  // Handle move to wishlist
  const handleMoveToWishlist = () => {
    if (!wishlistId) {
      toast({
        title: 'No wishlist available',
        description: 'Please create a wishlist first to save this item.',
        variant: 'destructive',
      });
      return;
    }
    
    dispatch(addToWishlist({
      wishlistId,
      item: {
        productId: item.productId,
        variantId: item.variantId,
        product: item.product,
        variant: item.variant,
        addedAt: new Date().toISOString(),
      }
    }));
    
    dispatch(moveToWishlist({
      itemId: item.id,
      wishlistId
    }));
    
    toast({
      title: 'Moved to wishlist',
      description: 'Item has been moved to your wishlist.',
      variant: 'default',
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 flex-shrink-0 rounded-md border overflow-hidden">
            <img 
              src={item.product?.imageUrl || 'https://via.placeholder.com/96'} 
              alt={item.product?.name || 'Product'} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex-1">
            <h3 className="font-medium mb-1">{item.product?.name || 'Product'}</h3>
            
            {/* Product Variant */}
            {item.variant && Object.keys(item.variant).length > 0 && (
              <div className="text-sm text-muted-foreground mb-1">
                {Object.entries(item.variant)
                  .filter(([key]) => !['id', 'productId'].includes(key))
                  .map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </span>
                  ))}
              </div>
            )}
            
            {/* SKU and other details */}
            <div className="text-xs text-muted-foreground mb-2">
              SKU: {item.sku}
              {item.isDigital && <span className="ml-2">Digital Product</span>}
            </div>
            
            {/* Price */}
            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="font-medium">
                  ${item.unitPrice.toFixed(2)}
                </div>
                {item.discountTotal > 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Discount: -${item.discountTotal.toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                
                <span className="w-8 text-center font-medium">
                  {isUpdating ? '...' : item.quantity}
                </span>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isUpdating || item.quantity >= 10}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
            </div>
            
            {/* Item Total */}
            <div className="text-sm font-medium mt-2">
              Total: ${item.total.toFixed(2)}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMoveToWishlist}
              disabled={!wishlistId}
              className="h-8"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemove}
              className="h-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
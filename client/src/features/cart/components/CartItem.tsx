import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trash,
  Heart,
  Plus,
  Minus,
  Gift,
  Package
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  removeFromCart,
  updateQuantity,
  saveForLater,
} from '../cartSlice';
import { addToWishlist } from '@/features/wishlist/wishlistSlice';

interface CartItemProps {
  item: CartItemType;
  wishlistId?: string;
}

export function CartItem({ item, wishlistId }: CartItemProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  };

  const handleQuantityIncrease = () => {
    if (item.quantity < 99) {
      dispatch(updateQuantity({
        id: item.id,
        quantity: item.quantity + 1
      }));
    }
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({
        id: item.id,
        quantity: item.quantity - 1
      }));
    } else {
      handleRemove();
    }
  };

  const handleSaveForLater = () => {
    dispatch(saveForLater(item.id));
    toast({
      title: 'Saved for later',
      description: 'This item has been saved for later.',
    });
  };

  const handleMoveToWishlist = () => {
    if (wishlistId) {
      dispatch(addToWishlist({
        wishlistId,
        product: item.product,
        productId: item.productId,
        variantId: item.variantId,
        variant: item.variant
      }));
      
      dispatch(removeFromCart(item.id));
      
      toast({
        title: 'Added to wishlist',
        description: 'Item has been moved to your wishlist.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'Select a wishlist',
        description: 'Please select a wishlist first.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            {item.product.imageUrl ? (
              <img 
                src={item.product.imageUrl} 
                alt={item.product.name || 'Product image'} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{item.product.name}</h3>
              <p className="font-semibold">{formatCurrency(item.total)}</p>
            </div>
            
            {/* Product Variant & Options */}
            {item.variant && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {item.variant.options?.map((opt, i) => (
                  <span key={i}>
                    {opt.name}: <span className="font-medium">{opt.value}</span>
                    {i < (item.variant?.options?.length || 0) - 1 ? ' / ' : ''}
                  </span>
                ))}
              </div>
            )}
            
            {/* Price details */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {formatCurrency(item.unitPrice)} each
              {item.discountTotal > 0 && (
                <span className="ml-2 text-green-600 dark:text-green-500">
                  ({formatCurrency(item.discountTotal)} off)
                </span>
              )}
            </div>
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              {item.isDigital && (
                <Badge variant="outline" className="text-xs">Digital</Badge>
              )}
              {!item.requiresShipping && (
                <Badge variant="outline" className="text-xs">No Shipping</Badge>
              )}
              {item.giftWrapping?.enabled && (
                <Badge variant="outline" className="text-xs flex items-center">
                  <Gift className="w-3 h-3 mr-1" />
                  Gift Wrapped
                </Badge>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleQuantityDecrease}
                  className="h-8 w-8"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleQuantityIncrease}
                  className="h-8 w-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSaveForLater}
                  className="text-xs"
                >
                  Save for later
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleMoveToWishlist}
                  className="h-8 w-8"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRemove}
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
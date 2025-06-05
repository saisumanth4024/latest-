import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '@/router/wouterCompat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trash,
  Heart,
  Package,
  Minus,
  Plus,
  ArrowDownToDot,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types';
import { removeFromCart, updateQuantity, saveForLater } from '../cartSlice';
import { addToWishlist } from '@/features/wishlist/wishlistSlice';

interface CartItemProps {
  item: CartItemType;
  defaultWishlistId?: string;
}

export function CartItem({ item, defaultWishlistId }: CartItemProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(item.quantity);

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= 99) {
      setQuantity(newQuantity);
      dispatch(updateQuantity({
        id: item.id,
        quantity: newQuantity
      }));
    }
  };

  // Handle remove item
  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  };

  // Handle save for later
  const handleSaveForLater = () => {
    dispatch(saveForLater(item.id));
    
    toast({
      title: 'Saved for later',
      description: 'The item has been saved for later.',
      variant: 'success',
    });
  };

  // Handle add to wishlist
  const handleAddToWishlist = () => {
    if (defaultWishlistId) {
      dispatch(addToWishlist({
        wishlistId: defaultWishlistId,
        productId: item.productId,
        variantId: item.variantId,
        product: item.product,
        variant: item.variant
      }));
      
      // Remove from cart
      dispatch(removeFromCart(item.id));
      
      toast({
        title: 'Added to wishlist',
        description: 'The item has been moved to your wishlist.',
        variant: 'success',
      });
    } else {
      toast({
        title: 'No wishlist found',
        description: 'Please create a wishlist first.',
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
              <Link href={`/products/${item.product.slug || item.productId}`}>
                <h3 className="font-semibold text-lg hover:underline cursor-pointer">{item.product.name}</h3>
              </Link>
              <p className="font-semibold">
                {formatCurrency(item.unitPrice)}
                {item.product.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatCurrency(item.product.compareAtPrice)}
                  </span>
                )}
              </p>
            </div>
            
            {/* Variant info if available */}
            {item.variant && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Object.entries(item.options || {}).map(([key, value], i, arr) => (
                  <span key={key}>
                    {key}: <span className="font-medium">{value}</span>
                    {i < arr.length - 1 ? ' / ' : ''}
                  </span>
                ))}
              </div>
            )}
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2 my-2">
              {item.isDigital && (
                <Badge variant="outline">Digital</Badge>
              )}
              {item.product.onSale && (
                <Badge variant="destructive">Sale</Badge>
              )}
            </div>
            
            {/* Quantity and Subtotal */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="h-8 px-3 flex items-center justify-center border-y border-input">
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-right">
                <div className="font-medium">
                  {formatCurrency(item.subtotal)}
                </div>
                {item.discountTotal > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    You save {formatCurrency(item.discountTotal)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end mt-3 space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSaveForLater}
                className="h-8 gap-1"
              >
                <ArrowDownToDot className="w-3.5 h-3.5" />
                Save for later
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleAddToWishlist}
                className="h-8 gap-1"
                disabled={!defaultWishlistId}
              >
                <Heart className="w-3.5 h-3.5" />
                Move to wishlist
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRemove}
                className="h-8 gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash className="w-3.5 h-3.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartItem;
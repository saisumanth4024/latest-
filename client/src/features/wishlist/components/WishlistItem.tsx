import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '@/router/wouterCompat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Trash,
  ShoppingCart,
  Package,
  ArrowUpDown,
  Pencil
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WishlistItem as WishlistItemType } from '../wishlistSlice';
import { formatCurrency } from '@/lib/utils';
import { removeFromWishlist, updateItemNotes } from '../wishlistSlice';
import { addToCart } from '@/features/cart/cartSlice';

interface WishlistItemProps {
  item: WishlistItemType;
  wishlistId: string;
  onMoveToAnotherList?: () => void;
  onEditNotes?: () => void;
}

export function WishlistItem({ 
  item, 
  wishlistId, 
  onMoveToAnotherList,
  onEditNotes 
}: WishlistItemProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Handle move to cart
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
        isTaxExempt: false,
        options: {},
        weight: item.product.weight
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

  // Handle remove from wishlist
  const handleRemove = () => {
    dispatch(removeFromWishlist({
      wishlistId,
      itemId: item.id
    }));
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your wishlist.',
    });
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
                {formatCurrency(item.product.price || 0)}
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
                {item.variant.options?.map((opt: any, i: number) => (
                  <span key={i}>
                    {opt.name}: <span className="font-medium">{opt.value}</span>
                    {i < (item.variant?.options?.length || 0) - 1 ? ' / ' : ''}
                  </span>
                ))}
              </div>
            )}
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2 my-2">
              {item.product.isNew && (
                <Badge>New</Badge>
              )}
              {item.product.onSale && (
                <Badge variant="destructive">Sale</Badge>
              )}
              {!item.product.inStock && (
                <Badge variant="outline" className="text-xs">Out of Stock</Badge>
              )}
            </div>
            
            {/* Notes */}
            {item.notes && (
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-sm my-2">
                <p className="italic">"{item.notes}"</p>
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Added {new Date(item.addedAt).toLocaleDateString()}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end mt-2 space-x-2">
              {onEditNotes && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onEditNotes}
                  className="h-8 gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Notes
                </Button>
              )}
              
              {onMoveToAnotherList && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onMoveToAnotherList}
                  className="h-8 gap-1"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Move
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleMoveToCart}
                className="h-8 gap-1"
                disabled={!item.product.inStock}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
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

export default WishlistItem;
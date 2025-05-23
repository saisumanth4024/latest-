import React from 'react';
import { useAppDispatch } from '@/app/hooks';
import { 
  updateCartItemQuantity, 
  removeFromCart,
  moveToWishlist,
  saveForLater
} from '../cartSlice';
import { addFromCart } from '@/features/wishlist/wishlistSlice';
import { CartItem as CartItemType } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Trash2,
  Heart,
  Bookmark,
  Plus,
  Minus,
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) return; // Don't allow zero or negative quantities
    
    if (newQuantity > 10) {
      toast({
        title: 'Maximum quantity reached',
        description: 'You cannot add more than 10 units of this item.',
        variant: 'destructive',
      });
      newQuantity = 10;
    }
    
    dispatch(updateCartItemQuantity({
      itemId: item.id,
      quantity: newQuantity,
    }));
    
    toast({
      title: 'Cart updated',
      description: `Quantity updated to ${newQuantity}.`,
      variant: 'default',
    });
  };

  // Handle quantity increment
  const handleIncrement = () => {
    if (item.quantity < 10) {
      handleQuantityChange(item.quantity + 1);
    } else {
      toast({
        title: 'Maximum quantity reached',
        description: 'You cannot add more than 10 units of this item.',
        variant: 'destructive',
      });
    }
  };

  // Handle quantity decrement
  const handleDecrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  // Handle remove item
  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast({
      title: 'Item removed',
      description: `${item.product.name} has been removed from your cart.`,
      variant: 'default',
    });
  };

  // Handle move to wishlist
  const handleMoveToWishlist = () => {
    dispatch(addFromCart({ cartItem: item }));
    dispatch(moveToWishlist(item.id));
    toast({
      title: 'Moved to wishlist',
      description: `${item.product.name} has been moved to your wishlist.`,
      variant: 'default',
    });
  };

  // Handle save for later
  const handleSaveForLater = () => {
    dispatch(addFromCart({ cartItem: item }));
    dispatch(saveForLater(item.id));
    toast({
      title: 'Saved for later',
      description: `${item.product.name} has been saved for later in your wishlist.`,
      variant: 'default',
    });
  };

  return (
    <div className="flex items-center py-4 border-b last:border-b-0">
      {/* Product Image & Info */}
      <div className="flex items-center w-1/2">
        <div className="w-20 h-20 rounded-md border overflow-hidden flex-shrink-0">
          <img 
            src={item.product.imageUrl || 'https://via.placeholder.com/80'} 
            alt={item.product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="font-medium text-base">{item.product.name}</h3>
          <div className="text-sm text-muted-foreground">
            {item.variant && (
              <span className="mr-2">
                {Object.entries(item.variant)
                  .filter(([key]) => !['id', 'productId'].includes(key))
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </span>
            )}
            <span>SKU: {item.sku}</span>
          </div>
        </div>
      </div>

      {/* Price, Quantity, Total */}
      <div className="flex justify-end w-1/2">
        <div className="w-24 text-center">
          ${item.unitPrice.toFixed(2)}
        </div>
        <div className="w-24 flex items-center justify-center">
          <div className="flex items-center">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-7 w-7" 
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input 
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              className="w-12 h-7 mx-1 text-center"
            />
            <Button 
              size="icon" 
              variant="outline" 
              className="h-7 w-7" 
              onClick={handleIncrement}
              disabled={item.quantity >= 10}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="w-24 text-center font-medium">
          ${item.total.toFixed(2)}
        </div>
        <div className="w-8 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMoveToWishlist}>
                <Heart className="w-4 h-4 mr-2" />
                Move to Wishlist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSaveForLater}>
                <Bookmark className="w-4 h-4 mr-2" />
                Save for Later
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemove}>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
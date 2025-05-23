import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RootState } from '@/app/store';
import { fetchCart, clearCart } from '../cartSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import PromoCodeForm from './PromoCodeForm';
import EmptyCart from './EmptyCart';

export function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, status, error } = useSelector((state: RootState) => state.cart);
  const { wishlists } = useSelector((state: RootState) => state.wishlist);
  
  const defaultWishlistId = wishlists.length > 0 ? wishlists[0].id.toString() : undefined;
  
  useEffect(() => {
    // Fetch cart data if needed
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);
  
  const handleCheckout = () => {
    // Redirect to checkout page
    navigate('/checkout');
    toast({
      title: 'Proceeding to checkout',
      description: 'Taking you to the checkout page...',
    });
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart.',
    });
  };
  
  // Loading state
  if (status === 'loading' && !cart) {
    return (
      <div className="container max-w-6xl py-8 mx-auto">
        <div className="flex flex-col gap-8 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container max-w-6xl py-8 mx-auto">
        <div className="p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
          <Button 
            onClick={() => dispatch(fetchCart())}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container max-w-6xl py-8 mx-auto">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <EmptyCart />
      </div>
    );
  }
  
  // Cart with items
  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart ({cart.items.length} items)</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove all items from your cart. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleClearCart}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              wishlistId={defaultWishlistId}
            />
          ))}
          
          {/* Promo Code Section */}
          <div className="mt-8">
            <PromoCodeForm coupons={cart.coupons} />
          </div>
        </div>
        
        {/* Cart Summary */}
        <div>
          <CartSummary 
            totals={cart.totals} 
            itemCount={cart.items.length}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
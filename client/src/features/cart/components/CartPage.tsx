import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  initializeCart, 
  selectCart, 
  selectCartItems, 
  selectCartTotals, 
  selectCartIsEmpty,
  selectCartIsLoading,
  selectCartError,
  clearCart
} from '../cartSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import PromoCodeForm from './PromoCodeForm';
import EmptyCart from './EmptyCart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const cartItems = useAppSelector(selectCartItems);
  const cartTotals = useAppSelector(selectCartTotals);
  const isEmpty = useAppSelector(selectCartIsEmpty);
  const isLoading = useAppSelector(selectCartIsLoading);
  const error = useAppSelector(selectCartError);
  const { toast } = useToast();

  // Initialize cart if needed
  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);

  // Handle clearing cart
  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart? This cannot be undone.')) {
      dispatch(clearCart());
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
        variant: 'default',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-6 my-4">
          <h2 className="text-red-800 dark:text-red-300 text-lg font-medium">Error loading cart</h2>
          <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-muted-foreground"
          onClick={handleClearCart}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                <div className="w-1/2">Product</div>
                <div className="flex justify-end w-1/2">
                  <div className="w-24 text-center">Price</div>
                  <div className="w-24 text-center">Quantity</div>
                  <div className="w-24 text-center">Total</div>
                  <div className="w-8"></div>
                </div>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm divide-y">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              <CartSummary totals={cartTotals} />
            </div>
            
            <div className="p-6">
              <PromoCodeForm />
            </div>
            
            <div className="p-6">
              <Button className="w-full" size="lg">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
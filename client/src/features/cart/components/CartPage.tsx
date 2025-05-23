import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectCart, 
  selectCartIsLoading, 
  selectCartError, 
  initializeCart,
  clearCart
} from '../cartSlice';
import { 
  selectWishlists,
  selectActiveWishlistId,
  initializeWishlists
} from '@/features/wishlist/wishlistSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import PromoCodeForm from './PromoCodeForm';
import EmptyCart from './EmptyCart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const isLoading = useAppSelector(selectCartIsLoading);
  const error = useAppSelector(selectCartError);
  const wishlists = useAppSelector(selectWishlists);
  const activeWishlistId = useAppSelector(selectActiveWishlistId);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  // Initialize cart and wishlists when component mounts
  useEffect(() => {
    dispatch(initializeCart());
    dispatch(initializeWishlists());
  }, [dispatch]);

  // Set selected wishlist ID when wishlists are loaded
  useEffect(() => {
    if (wishlists.length > 0) {
      setSelectedWishlistId(activeWishlistId || wishlists[0].id as string);
    }
  }, [wishlists, activeWishlistId]);

  // Handle clear cart
  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      dispatch(clearCart());
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
        variant: 'default',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingBag className="mr-3 h-8 w-8" />
          Your Cart
          <span className="ml-3 text-lg font-normal text-muted-foreground">
            ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          disabled={cart.items.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Wishlist Selector */}
          <div className="flex items-center mb-4">
            <span className="text-sm mr-2">Save to Wishlist:</span>
            <Select
              value={selectedWishlistId}
              onValueChange={(value) => setSelectedWishlistId(value)}
              disabled={wishlists.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select wishlist" />
              </SelectTrigger>
              <SelectContent>
                {wishlists.map((wishlist) => (
                  <SelectItem key={wishlist.id as string} value={wishlist.id as string}>
                    {wishlist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* List of Cart Items */}
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              wishlistId={selectedWishlistId}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <Separator className="mb-4" />

            <CartSummary totals={cart.totals} />
            <Separator className="my-4" />

            <PromoCodeForm />
            <Separator className="my-4" />

            <Button className="w-full" size="lg">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-4">
              <Link href="/products">
                <Button variant="link" size="sm" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
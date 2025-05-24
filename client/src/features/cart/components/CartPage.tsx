import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Loader2, 
  ShoppingCart, 
  ArchiveRestore, 
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/app/store';
import { fetchCart, clearCart } from '../cartSlice';
import { fetchWishlists, selectDefaultWishlist } from '@/features/wishlist/wishlistSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import PromoCodeForm from './PromoCodeForm';
import EmptyCart from './EmptyCart';

export function CartPage() {
  const dispatch = useDispatch();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Get cart state from Redux
  const { cart, status, error, savedItems } = useSelector((state: RootState) => state.cart);
  
  // Get default wishlist
  const defaultWishlist = useSelector(selectDefaultWishlist);
  
  // Load cart and wishlists
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
      dispatch(fetchWishlists());
    }
  }, [dispatch, status]);
  
  // Handle checkout
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: 'Checkout temporarily unavailable',
        description: 'This is a demo application. Checkout functionality is not fully implemented.',
        variant: 'default',
      });
      setIsCheckingOut(false);
    }, 1500);
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      dispatch(clearCart());
      
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
      });
    }
  };
  
  // Loading state
  if (status === 'loading' || !cart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }
  
  // Error state
  if (status === 'failed' && error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="h-12 w-12 text-destructive mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => dispatch(fetchCart())}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Empty cart
  if (cart.items.length === 0) {
    return (
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0 mb-4">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>
        
        <EmptyCart />
        
        {savedItems.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Saved For Later ({savedItems.length})</h2>
            </div>
            
            <div className="space-y-4">
              {savedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-white">
                    {item.product.imageUrl ? (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name || 'Product'} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingCart className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        dispatch({
                          type: 'cart/moveToCart',
                          payload: item.id
                        });
                        toast({
                          title: 'Item moved to cart',
                          description: 'The item has been moved to your cart.',
                          variant: 'success',
                        });
                      }}
                    >
                      <ArchiveRestore className="mr-1 h-3.5 w-3.5" />
                      Move to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Render cart with items
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="p-0 mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            className="text-red-500 border-red-200 hover:text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                defaultWishlistId={defaultWishlist?.id}
              />
            ))}
          </div>
          
          {/* Saved Items */}
          {savedItems.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Saved For Later ({savedItems.length})</h2>
              </div>
              
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-white">
                      {item.product.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name || 'Product'} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <ShoppingCart className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          dispatch({
                            type: 'cart/moveToCart',
                            payload: item.id
                          });
                          toast({
                            title: 'Item moved to cart',
                            description: 'The item has been moved to your cart.',
                            variant: 'success',
                          });
                        }}
                      >
                        <ArchiveRestore className="mr-1 h-3.5 w-3.5" />
                        Move to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Promo Code Form */}
          <div>
            <PromoCodeForm appliedCoupons={cart.coupons} />
          </div>
          
          <Separator />
          
          {/* Cart Summary */}
          <CartSummary cart={cart} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
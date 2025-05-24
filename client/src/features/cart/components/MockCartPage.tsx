import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Trash2,
  ShoppingCart,
  ChevronRight,
  RefreshCw,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for the cart
const MOCK_CART_ITEMS = [
  {
    id: '1',
    productId: '101',
    name: 'Premium Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with 40h battery life',
    price: 299.99,
    quantity: 1,
    image: 'https://i.imgur.com/jNNT4LE.jpg',
    maxQuantity: 5,
    addedAt: new Date().toISOString(),
  },
  {
    id: '2',
    productId: '102',
    name: 'Ultra HD Smart TV 55"',
    description: '4K Smart TV with HDR and built-in streaming apps',
    price: 899.99,
    quantity: 1,
    image: 'https://i.imgur.com/D5yJDGJ.jpg',
    maxQuantity: 3,
    addedAt: new Date().toISOString(),
  }
];

// CartItem component
const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onMoveToWishlist 
}: any) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/4 h-40 sm:h-auto mb-4 sm:mb-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-md"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = "https://placehold.co/400x300/e2e8f0/1e293b?text=Product+Image";
              }}
            />
          </div>
          <div className="flex-1 sm:ml-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                <p className="text-muted-foreground text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center">
                <label htmlFor={`quantity-${item.id}`} className="text-sm mr-2">
                  Qty:
                </label>
                <div className="flex border rounded-md w-24">
                  <button 
                    className="px-2 py-1 text-lg border-r"
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    min="1"
                    max={item.maxQuantity}
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= item.maxQuantity) {
                        onUpdateQuantity(item.id, val);
                      }
                    }}
                    className="w-full text-center border-0 focus:ring-0"
                  />
                  <button 
                    className="px-2 py-1 text-lg border-l"
                    onClick={() => onUpdateQuantity(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                    disabled={item.quantity >= item.maxQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMoveToWishlist(item)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Save for Later
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// CartSummary component
const CartSummary = ({ 
  subtotal, 
  tax, 
  shipping, 
  total, 
  onApplyPromo, 
  onCheckout 
}: any) => {
  const [promoCode, setPromoCode] = useState('');
  
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="font-medium text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping > 0 ? shipping.toFixed(2) : 'FREE'}</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button 
            variant="outline" 
            onClick={() => onApplyPromo(promoCode)}
            disabled={!promoCode}
          >
            Apply
          </Button>
        </div>
        
        <Button className="w-full" onClick={onCheckout}>
          Checkout
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Empty cart component
const EmptyCart = () => {
  const [, navigate] = useLocation();
  
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Looks like you haven't added any products to your cart yet.
        Browse our products and find something you'll love.
      </p>
      <Button onClick={() => navigate('/products')}>
        Continue Shopping
      </Button>
    </div>
  );
};

// Main MockCartPage component
const MockCartPage: React.FC = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping - discount;
  
  // Handle updating quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Handle removing item
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      variant: "default",
    });
  };
  
  // Handle moving item to wishlist
  const handleMoveToWishlist = (item: any) => {
    setCartItems(prev => prev.filter(i => i.id !== item.id));
    
    toast({
      title: "Saved for later",
      description: `${item.name} has been added to your wishlist.`,
      variant: "default",
    });
  };
  
  // Handle applying promo code
  const handleApplyPromo = (code: string) => {
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);
      
      if (code.toUpperCase() === 'SAVE10') {
        const newDiscount = subtotal * 0.1; // 10% off
        setDiscount(newDiscount);
        
        toast({
          title: "Promo code applied",
          description: `You saved $${newDiscount.toFixed(2)} with this code!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "This code is invalid or has expired.",
          variant: "destructive",
        });
      }
    }, 1000);
  };
  
  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <EmptyCart />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              onMoveToWishlist={handleMoveToWishlist}
            />
          ))}
        </div>
        
        <div>
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            discount={discount}
            total={total}
            onApplyPromo={handleApplyPromo}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default MockCartPage;
import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Cart } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
}

export function CartSummary({ cart, onCheckout }: CartSummaryProps) {
  const { totals, items } = cart;
  
  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          
          {cart.coupons.length > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discounts</span>
              <span>-{formatCurrency(totals.discountTotal)}</span>
            </div>
          )}
          
          {totals.taxTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Tax</span>
              <span>{formatCurrency(totals.taxTotal)}</span>
            </div>
          )}
          
          {totals.shippingTotal > 0 ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(totals.shippingTotal)}</span>
            </div>
          ) : cart.isDigitalOnly ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600 dark:text-green-400">Free (Digital Products)</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
        
        {cart.coupons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Applied Coupons</h4>
            <div className="space-y-2">
              {cart.coupons.map((coupon) => (
                <div key={coupon.code} className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span className="font-medium">{coupon.code}</span>
                    {coupon.description && (
                      <span className="text-muted-foreground ml-2">({coupon.description})</span>
                    )}
                  </div>
                  <span className="text-green-600 dark:text-green-400">
                    -{formatCurrency(coupon.discountAmount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col px-6 pb-6 pt-0 gap-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={onCheckout}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Proceed to Checkout
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          size="lg"
          asChild
        >
          <Link href="/products">
            Continue Shopping
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartSummary;
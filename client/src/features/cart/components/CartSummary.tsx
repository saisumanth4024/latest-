import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartTotals } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';

interface CartSummaryProps {
  totals: CartTotals;
  itemCount: number;
  onCheckout: () => void;
}

export function CartSummary({ totals, itemCount, onCheckout }: CartSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          
          {totals.discountTotal > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-500">
              <span>Discount</span>
              <span>-{formatCurrency(totals.discountTotal)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
            {totals.shippingTotal > 0 ? (
              <span>{formatCurrency(totals.shippingTotal)}</span>
            ) : (
              <span className="text-green-600 dark:text-green-500">Free</span>
            )}
          </div>
          
          {totals.taxTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span>{formatCurrency(totals.taxTotal)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totals.currency === 'USD' ? 'USD' : totals.currency}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          onClick={onCheckout}
          disabled={itemCount === 0}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Checkout ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartSummary;
import React from 'react';
import { CartTotals } from '@/types/cart';
import { Separator } from '@/components/ui/separator';

interface CartSummaryProps {
  totals: CartTotals | undefined;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totals }) => {
  if (!totals) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatCurrency(totals.subtotal)}</span>
      </div>
      
      {totals.discountTotal > 0 && (
        <div className="flex justify-between text-green-600 dark:text-green-400">
          <span>Discount</span>
          <span>-{formatCurrency(totals.discountTotal)}</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span>
          {totals.shippingTotal > 0 
            ? formatCurrency(totals.shippingTotal) 
            : 'Free'}
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-muted-foreground">Tax</span>
        <span>{formatCurrency(totals.taxTotal)}</span>
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-medium text-lg">
        <span>Total</span>
        <span>{formatCurrency(totals.total)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
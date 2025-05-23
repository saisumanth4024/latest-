import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  applyPromoCode,
  removeCoupon,
  clearPromoCode,
  selectCart
} from '../cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const PromoCodeForm: React.FC = () => {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCart);
  const { toast } = useToast();

  const appliedCoupons = cart?.coupons || [];

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a promo code.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if already applied
    if (appliedCoupons.some(coupon => coupon.code === code)) {
      toast({
        title: 'Error',
        description: 'This promo code has already been applied.',
        variant: 'destructive',
      });
      setCode('');
      return;
    }
    
    setIsApplying(true);
    
    try {
      const resultAction = await dispatch(applyPromoCode(code));
      
      if (applyPromoCode.fulfilled.match(resultAction)) {
        toast({
          title: 'Success',
          description: 'Promo code applied successfully!',
          variant: 'success',
        });
        setCode('');
      } else if (applyPromoCode.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload || 'Failed to apply promo code.';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = (couponCode: string) => {
    dispatch(removeCoupon(couponCode));
    dispatch(clearPromoCode());
    toast({
      title: 'Removed',
      description: `Coupon ${couponCode} has been removed.`,
      variant: 'default',
    });
  };

  return (
    <div>
      <h3 className="text-base font-medium mb-2">Promo Code</h3>
      
      {/* Applied coupons */}
      {appliedCoupons.length > 0 && (
        <div className="mb-3 space-y-2">
          {appliedCoupons.map(coupon => (
            <div key={coupon.code} className="flex items-center justify-between">
              <Badge variant="outline" className="py-1.5 text-xs">
                <TagIcon className="w-3 h-3 mr-1.5" />
                {coupon.code}
                {coupon.type === 'percentage' && ` - ${coupon.value}% off`}
                {coupon.type === 'fixed' && ` - $${coupon.value} off`}
                {coupon.type === 'free_shipping' && ` - Free shipping`}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-muted-foreground"
                onClick={() => handleRemoveCoupon(coupon.code)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove coupon</span>
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Form to apply new promo code */}
      <form onSubmit={handleApplyCode} className="flex gap-2 mt-2">
        <Input
          type="text"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="secondary" disabled={isApplying}>
          {isApplying ? 'Applying...' : 'Apply'}
        </Button>
      </form>
      
      {/* Demo hint */}
      <p className="text-xs text-muted-foreground mt-2">
        Try these demo codes: WELCOME10, SAVE20, FREESHIP
      </p>
    </div>
  );
};

export default PromoCodeForm;
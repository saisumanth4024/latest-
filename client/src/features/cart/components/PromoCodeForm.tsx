import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, X, Tag, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartCoupon } from '@/types';
import { applyCoupon, removeCoupon } from '../cartSlice';

// Form validation schema
const promoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required').max(20)
});

interface PromoCodeFormProps {
  coupons: CartCoupon[];
}

export function PromoCodeForm({ coupons }: PromoCodeFormProps) {
  const [isApplying, setIsApplying] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof promoCodeSchema>>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: ''
    }
  });
  
  const onSubmit = async (data: z.infer<typeof promoCodeSchema>) => {
    setIsApplying(true);
    
    try {
      // Check if coupon is already applied
      const isAlreadyApplied = coupons.some(
        coupon => coupon.code.toLowerCase() === data.code.toLowerCase()
      );
      
      if (isAlreadyApplied) {
        toast({
          title: 'Coupon already applied',
          description: 'This coupon code has already been applied to your cart.',
          variant: 'destructive',
        });
        return;
      }
      
      // Simulate API call to validate coupon
      setTimeout(() => {
        // For demo purposes, validate any coupon code
        const couponType = Math.random() > 0.5 ? 'percentage' : 'fixed';
        const couponValue = couponType === 'percentage' ? 10 : 5;
        
        dispatch(applyCoupon({
          code: data.code,
          type: couponType as 'percentage' | 'fixed',
          value: couponValue,
          discountAmount: 0, // This will be calculated by the reducer
          description: couponType === 'percentage' ? `${couponValue}% off your order` : `$${couponValue} off your order`,
          appliedAt: new Date().toISOString()
        }));
        
        toast({
          title: 'Coupon applied',
          description: `${data.code} has been applied to your cart.`,
          variant: 'success',
        });
        
        form.reset();
        setIsApplying(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: 'Failed to apply coupon',
        description: 'The coupon code you entered is invalid.',
        variant: 'destructive',
      });
      setIsApplying(false);
    }
  };
  
  const handleRemoveCoupon = (code: string) => {
    dispatch(removeCoupon(code));
    toast({
      title: 'Coupon removed',
      description: `${code} has been removed from your cart.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Apply Discount Code</h3>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter promo code"
            {...form.register('code')}
            className="w-full"
            disabled={isApplying}
          />
          {form.formState.errors.code && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.code.message}
            </p>
          )}
        </div>
        
        <Button type="submit" disabled={isApplying}>
          {isApplying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying
            </>
          ) : (
            'Apply'
          )}
        </Button>
      </form>
      
      {coupons.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Applied Coupons:</h4>
          <div className="flex flex-wrap gap-2">
            {coupons.map((coupon) => (
              <div 
                key={coupon.code}
                className="group inline-flex items-center bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm rounded-full px-3 py-1"
              >
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                <span className="mr-1">{coupon.code}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  className="ml-1 rounded-full p-0.5 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {coupons.map((coupon) => (
              <div key={coupon.code} className="flex items-start gap-2 mt-1">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>
                  <span className="font-medium">{coupon.code}</span>: {coupon.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PromoCodeForm;
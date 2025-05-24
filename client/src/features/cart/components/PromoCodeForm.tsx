import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CartCoupon } from '@/types';
import { applyCoupon, removeCoupon } from '../cartSlice';
import { X, Tag, Loader2 } from 'lucide-react';

// Demo coupons for testing
const VALID_COUPON_CODES = {
  'SAVE10': {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    description: '10% off your order'
  },
  'WELCOME20': {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    description: '20% off for new customers'
  },
  'FREESHIP': {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    description: 'Free shipping on your order'
  },
  'FLAT25': {
    code: 'FLAT25',
    type: 'fixed',
    value: 25,
    description: '$25 off your order'
  }
};

interface PromoCodeFormProps {
  appliedCoupons: CartCoupon[];
}

const promoSchema = z.object({
  code: z.string().min(1, { message: 'Promo code is required' })
});

type PromoFormValues = z.infer<typeof promoSchema>;

export function PromoCodeForm({ appliedCoupons }: PromoCodeFormProps) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: ''
    }
  });
  
  // For demo purposes, we'll simulate checking coupons
  const onSubmit = async (data: PromoFormValues) => {
    const couponCode = data.code.trim().toUpperCase();
    
    // Check if coupon is already applied
    if (appliedCoupons.some(coupon => coupon.code === couponCode)) {
      toast({
        title: 'Coupon already applied',
        description: 'This coupon has already been applied to your cart.',
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate API call
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Demo validation
    if (VALID_COUPON_CODES[couponCode as keyof typeof VALID_COUPON_CODES]) {
      const couponDetails = VALID_COUPON_CODES[couponCode as keyof typeof VALID_COUPON_CODES];
      
      dispatch(applyCoupon({
        ...couponDetails,
        code: couponCode,
        discountAmount: 0, // Will be calculated in the reducer
        appliedAt: new Date().toISOString()
      }));
      
      toast({
        title: 'Coupon applied',
        description: `${couponDetails.description} has been applied to your cart.`,
        variant: 'success',
      });
      
      reset();
    } else {
      toast({
        title: 'Invalid coupon',
        description: 'The coupon code you entered is invalid or has expired.',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };
  
  // Handle remove coupon
  const handleRemoveCoupon = (code: string) => {
    dispatch(removeCoupon(code));
    
    toast({
      title: 'Coupon removed',
      description: 'The coupon has been removed from your cart.',
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Promotional Code</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <div className="flex-1">
          <Input 
            placeholder="Enter code" 
            {...register('code')}
            className="uppercase"
          />
          {errors.code && (
            <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>Apply</>
          )}
        </Button>
      </form>
      
      {appliedCoupons.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Applied coupons:</p>
          {appliedCoupons.map((coupon) => (
            <Alert key={coupon.code} className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="flex items-center">
                    <span className="font-medium">{coupon.code}</span>
                    {coupon.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({coupon.description})
                      </span>
                    )}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveCoupon(coupon.code)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}

export default PromoCodeForm;
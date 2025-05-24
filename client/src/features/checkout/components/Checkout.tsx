import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Container } from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { fetchCart } from '@/features/cart/cartSlice';
import {
  setOrderTotal,
  selectActiveStep,
  selectCompletedSteps,
  selectOrder,
} from '../checkoutSlice';
import { CheckoutStep } from '@/types/checkout';
import AddressForm from './AddressForm';
import DeliverySelection from './DeliverySelection';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';
import OTPVerification from './OTPVerification';
import { useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/app/store';

// Define checkout steps for the stepper
const checkoutSteps = [
  { id: CheckoutStep.ADDRESS, title: 'Address' },
  { id: CheckoutStep.DELIVERY, title: 'Delivery' },
  { id: CheckoutStep.PAYMENT, title: 'Payment' },
  { id: CheckoutStep.SUMMARY, title: 'Summary' },
  { id: CheckoutStep.CONFIRMATION, title: 'Confirmation' },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const [location, navigate] = useLocation();
  
  // Get active step and completed steps from Redux
  const activeStep = useSelector(selectActiveStep);
  const completedSteps = useSelector(selectCompletedSteps);
  const order = useSelector(selectOrder);
  
  // Get cart from Redux
  const cartState = useReduxSelector((state: RootState) => state.cart);
  const { cart, status: cartStatus } = cartState;
  
  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartStatus === 'succeeded' && (!cart || cart.items.length === 0) && activeStep !== CheckoutStep.CONFIRMATION) {
      navigate('/cart');
    }
  }, [cart, cartStatus, navigate, activeStep]);
  
  // Fetch cart if not already loaded
  useEffect(() => {
    if (cartStatus === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, cartStatus]);
  
  // Set order total based on cart totals
  useEffect(() => {
    if (cart?.totals) {
      dispatch(setOrderTotal(cart.totals.total));
    }
  }, [dispatch, cart?.totals]);
  
  // Redirect to confirmation step if order is placed
  useEffect(() => {
    if (order && activeStep !== CheckoutStep.CONFIRMATION) {
      // If there's an order but we're not on the confirmation step,
      // it means the order was just placed, so go to confirmation
      dispatch({ type: 'checkout/setActiveStep', payload: CheckoutStep.CONFIRMATION });
    }
  }, [order, activeStep, dispatch]);

  // If cart is loading
  if (cartStatus === 'loading') {
    return (
      <Container className="py-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center py-24">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-48 mx-auto"></div>
            <div className="h-32 bg-muted rounded w-full max-w-md"></div>
          </div>
        </div>
      </Container>
    );
  }
  
  // If cart failed to load
  if (cartStatus === 'failed') {
    return (
      <Container className="py-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Error Loading Checkout</h2>
          <p className="text-muted-foreground mb-6">
            There was a problem loading your cart. Please try again.
          </p>
          <button
            onClick={() => dispatch(fetchCart())}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-8 max-w-4xl mx-auto">
      {/* Checkout Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground mt-1">
          Complete your purchase securely and easily.
        </p>
      </div>
      
      {/* Checkout Progress Steps (except for Confirmation) */}
      {activeStep !== CheckoutStep.CONFIRMATION && activeStep !== CheckoutStep.OTP_VERIFICATION && (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {checkoutSteps.slice(0, 4).map((step, i) => (
                <React.Fragment key={step.id}>
                  {i > 0 && (
                    <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ 
                          width: completedSteps.includes(step.id) ? '100%' : 
                            activeStep === step.id ? '50%' : '0%' 
                        }}
                      ></div>
                    </div>
                  )}
                  <div className="relative flex flex-col items-center">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                        activeStep === step.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : completedSteps.includes(step.id)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className="absolute mt-10 text-xs font-medium text-center w-max">
                      {step.title}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <Separator className="mb-8" />
        </>
      )}
      
      {/* Checkout Form Steps */}
      <div className="relative">
        {/* Address Step */}
        {activeStep === CheckoutStep.ADDRESS && <AddressForm />}
        
        {/* Delivery Step */}
        {activeStep === CheckoutStep.DELIVERY && <DeliverySelection />}
        
        {/* Payment Step */}
        {activeStep === CheckoutStep.PAYMENT && <PaymentForm />}
        
        {/* OTP Verification Step */}
        {activeStep === CheckoutStep.OTP_VERIFICATION && <OTPVerification />}
        
        {/* Summary Step */}
        {activeStep === CheckoutStep.SUMMARY && <OrderSummary />}
        
        {/* Confirmation Step */}
        {activeStep === CheckoutStep.CONFIRMATION && <OrderConfirmation />}
      </div>
      
      {/* Order Summary Sidebar (only show on address, delivery, and payment steps) */}
      {(activeStep === CheckoutStep.ADDRESS || 
        activeStep === CheckoutStep.DELIVERY || 
        activeStep === CheckoutStep.PAYMENT) && cart && (
        <div className="mt-8">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Order Summary ({cart.items.length} items)</h3>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name || ''} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      ${item.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.totals.subtotal.toFixed(2)}</span>
                </div>
                
                {cart.totals.discountTotal > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-500">
                    <span>Discounts</span>
                    <span>-${cart.totals.discountTotal.toFixed(2)}</span>
                  </div>
                )}
                
                {cart.totals.taxTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${cart.totals.taxTotal.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {cart.totals.shippingTotal > 0 ? (
                    <span>${cart.totals.shippingTotal.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-500">Free</span>
                  )}
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cart.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Container>
  );
}
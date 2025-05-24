import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ArrowLeft,
  Loader2,
  CreditCard,
  MapPin,
  Truck,
  ShoppingBag,
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  placeOrder,
  setActiveStep,
  processPayment,
  selectBillingAddress,
  selectShippingAddress,
  selectSelectedDeliverySlot,
  selectSelectedPaymentMethod,
  selectPaymentDetails,
  selectOrderTotal,
  selectProcessingPayment,
  selectPlacingOrder,
  selectCheckoutError,
} from '../checkoutSlice';
import { CheckoutStep, PaymentMethod } from '@/types/checkout';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/app/store';

export default function OrderSummary() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [orderNotes, setOrderNotes] = useState('');
  
  // Get cart data from Redux
  const cartState = useReduxSelector((state: RootState) => state.cart);
  const { cart } = cartState;
  
  // Get checkout data from Redux
  const billingAddress = useSelector(selectBillingAddress);
  const shippingAddress = useSelector(selectShippingAddress);
  const selectedDeliverySlot = useSelector(selectSelectedDeliverySlot);
  const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod);
  const paymentDetails = useSelector(selectPaymentDetails);
  const orderTotal = useSelector(selectOrderTotal);
  const isProcessingPayment = useSelector(selectProcessingPayment);
  const isPlacingOrder = useSelector(selectPlacingOrder);
  const error = useSelector(selectCheckoutError);
  
  const handleBackToPayment = () => {
    dispatch(setActiveStep(CheckoutStep.PAYMENT));
  };
  
  const handlePlaceOrder = async () => {
    if (!cart || !billingAddress || !shippingAddress || !selectedDeliverySlot || !selectedPaymentMethod) {
      toast({
        title: 'Cannot place order',
        description: 'Please complete all required information before placing your order.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Process payment first
      if (selectedPaymentMethod !== PaymentMethod.COD) {
        await dispatch(processPayment({
          paymentDetails: paymentDetails!,
          amount: orderTotal,
        }));
      }
      
      // Then place the order
      await dispatch(placeOrder({
        cartId: cart.id,
        orderData: {
          userId: undefined, // Will be set server-side in real app
          status: 'confirmed',
          items: cart.items,
          totals: cart.totals,
          billingAddress,
          shippingAddress,
          shippingMethod: {
            ...selectedDeliverySlot,
            name: `Delivery on ${format(new Date(selectedDeliverySlot.date), 'MMM d')} between ${selectedDeliverySlot.startTime}-${selectedDeliverySlot.endTime}`,
            carrier: 'Standard Delivery',
            id: selectedDeliverySlot.id,
            cost: selectedDeliverySlot.fee || 0,
            isDefault: false,
          },
          paymentMethod: selectedPaymentMethod,
          notes: orderNotes.trim() || undefined,
        },
      }));
      
      // Success Toast
      toast({
        title: 'Order Placed Successfully!',
        description: 'Your order has been confirmed. You will receive a confirmation email shortly.',
        variant: 'success',
      });
    } catch (err) {
      // Error handling is done in the thunks themselves
      // This catch just prevents the component from crashing
    }
  };
  
  // Error message for payment failure
  if (error && (isProcessingPayment || isPlacingOrder)) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Payment Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <Button 
            variant="outline" 
            onClick={handleBackToPayment} 
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Payment
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!cart || !billingAddress || !shippingAddress || !selectedDeliverySlot || !selectedPaymentMethod) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Missing Information</AlertTitle>
            <AlertDescription>
              Some required information is missing. Please go back and complete all steps.
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="outline" 
            onClick={handleBackToPayment} 
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Payment
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Address */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <MapPin className="h-5 w-5 mr-2" />
            Shipping Address
          </h3>
          <div className="bg-muted/30 p-3 rounded-md">
            <p><strong>{shippingAddress.firstName} {shippingAddress.lastName}</strong></p>
            <p>{shippingAddress.address1}</p>
            {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postcode}</p>
            <p>{shippingAddress.country}</p>
            <p>{shippingAddress.phone}</p>
          </div>
        </div>
        
        <Separator />
        
        {/* Delivery Slot */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <Calendar className="h-5 w-5 mr-2" />
            Delivery Details
          </h3>
          <div className="bg-muted/30 p-3 rounded-md">
            <p>
              <strong>
                {format(new Date(selectedDeliverySlot.date), 'EEEE, MMMM d, yyyy')}
              </strong>
            </p>
            <p>Between {selectedDeliverySlot.startTime} - {selectedDeliverySlot.endTime}</p>
            {selectedDeliverySlot.fee ? (
              <p className="text-sm mt-1">
                Express delivery: {formatCurrency(selectedDeliverySlot.fee)}
              </p>
            ) : (
              <p className="text-sm mt-1 text-green-600 dark:text-green-500">
                Free standard delivery
              </p>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Method
          </h3>
          <div className="bg-muted/30 p-3 rounded-md">
            {selectedPaymentMethod === PaymentMethod.CREDIT_CARD && (
              <div>
                <p><strong>Credit Card</strong></p>
                {paymentDetails?.details && 'cardNumber' in paymentDetails.details && (
                  <>
                    <p>
                      Card ending in {paymentDetails.details.cardNumber.slice(-4)}
                    </p>
                    <p>
                      Expires {paymentDetails.details.expiryMonth}/{paymentDetails.details.expiryYear.slice(-2)}
                    </p>
                  </>
                )}
              </div>
            )}
            
            {selectedPaymentMethod === PaymentMethod.UPI && (
              <div>
                <p><strong>UPI Payment</strong></p>
                {paymentDetails?.details && 'upiId' in paymentDetails.details && (
                  <p>UPI ID: {paymentDetails.details.upiId}</p>
                )}
              </div>
            )}
            
            {selectedPaymentMethod === PaymentMethod.WALLET && (
              <div>
                <p><strong>Wallet Payment</strong></p>
                {paymentDetails?.details && 'provider' in paymentDetails.details && (
                  <p>Provider: {paymentDetails.details.provider}</p>
                )}
              </div>
            )}
            
            {selectedPaymentMethod === PaymentMethod.BANK_TRANSFER && (
              <div>
                <p><strong>Bank Transfer</strong></p>
                {paymentDetails?.details && 'bankName' in paymentDetails.details && (
                  <>
                    <p>Bank: {paymentDetails.details.bankName}</p>
                    <p>Account: ****{paymentDetails.details.accountNumber.slice(-4)}</p>
                  </>
                )}
              </div>
            )}
            
            {selectedPaymentMethod === PaymentMethod.COD && (
              <div>
                <p><strong>Cash on Delivery</strong></p>
                <p>Pay cash when your order is delivered</p>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Order Items */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Order Items ({cart.items.length})
          </h3>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-muted/30 p-3 rounded-md">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name || ''} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Qty: {item.quantity}</span>
                    <span className="mx-2">•</span>
                    <span>{formatCurrency(item.unitPrice)}</span>
                  </div>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {Object.entries(item.options).map(([key, value], i, arr) => (
                        <span key={key}>
                          {key}: {value}
                          {i < arr.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="font-medium text-right">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Order Totals */}
        <div>
          <h3 className="text-lg font-medium mb-3">Order Total</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cart.totals.subtotal)}</span>
            </div>
            
            {cart.totals.discountTotal > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-500">
                <span>Discounts</span>
                <span>-{formatCurrency(cart.totals.discountTotal)}</span>
              </div>
            )}
            
            {cart.totals.taxTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(cart.totals.taxTotal)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              {cart.totals.shippingTotal > 0 ? (
                <span>{formatCurrency(cart.totals.shippingTotal)}</span>
              ) : (
                <span className="text-green-600 dark:text-green-500">Free</span>
              )}
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(cart.totals.total)}</span>
            </div>
          </div>
        </div>
        
        {/* Order Notes */}
        <div>
          <h3 className="text-lg font-medium mb-2">Order Notes (optional)</h3>
          <Textarea
            placeholder="Add special instructions for delivery or any other requests..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBackToPayment} disabled={isProcessingPayment || isPlacingOrder}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment
        </Button>
        
        <Button onClick={handlePlaceOrder} disabled={isProcessingPayment || isPlacingOrder}>
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : isPlacingOrder ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Order...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Place Order
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
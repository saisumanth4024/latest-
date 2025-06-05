import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@/router/wouterCompat';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Truck, 
  ShoppingBag, 
  ArrowRight,
  Copy,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resetCheckout, selectOrder } from '../checkoutSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { OrderStatus } from '@/types/checkout';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export default function OrderConfirmation() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const order = useSelector(selectOrder);
  
  if (!order) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-lg text-muted-foreground">No order information found.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Handle copy order ID
  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    toast({
      title: 'Order ID Copied',
      description: 'Order ID has been copied to your clipboard.',
    });
  };
  
  // Handle continue shopping
  const handleContinueShopping = () => {
    // Reset checkout state and clear cart
    dispatch(resetCheckout());
    dispatch(clearCart());
  };
  
  // Format status badge
  const getStatusBadge = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
      canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
      returned: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500',
      refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500',
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Overview */}
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Order #{order.id}</h3>
                <button 
                  onClick={handleCopyOrderId} 
                  className="text-primary hover:text-primary/80"
                  aria-label="Copy order ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {format(new Date(order.placedAt), 'MMMM d, yyyy, h:mm a')}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Information */}
            <div>
              <h4 className="text-sm font-medium flex items-center mb-1">
                <CreditCard className="h-4 w-4 mr-1" />
                Payment Information
              </h4>
              <div className="text-sm">
                <p>Method: {order.paymentMethod}</p>
                {order.transaction && (
                  <p>Transaction ID: {order.transaction.id}</p>
                )}
                <p className="font-medium">Total: {formatCurrency(order.totals.total)}</p>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div>
              <h4 className="text-sm font-medium flex items-center mb-1">
                <Truck className="h-4 w-4 mr-1" />
                Shipping Information
              </h4>
              <div className="text-sm">
                <p>Method: {order.shippingMethod.name}</p>
                {order.trackingNumber && (
                  <p>
                    Tracking: {order.trackingNumber}
                    {order.trackingUrl && (
                      <a 
                        href={order.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                      >
                        (Track)
                      </a>
                    )}
                  </p>
                )}
                {order.estimatedDelivery && (
                  <p>
                    Estimated Delivery: {format(new Date(order.estimatedDelivery), 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Delivery Information */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <MapPin className="h-5 w-5 mr-2" />
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping Address */}
            <div className="bg-muted/30 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Shipping Address</h4>
              <div className="text-sm">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
            
            {/* Delivery Slot */}
            {order.deliverySlot && (
              <div className="bg-muted/30 p-3 rounded-md">
                <h4 className="text-sm font-medium flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Delivery Schedule
                </h4>
                <div className="text-sm">
                  <p>
                    <strong>
                      {format(new Date(order.deliverySlot.date), 'EEEE, MMMM d, yyyy')}
                    </strong>
                  </p>
                  <p>Between {order.deliverySlot.startTime} - {order.deliverySlot.endTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Order Items */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Order Items ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
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
          <h3 className="text-lg font-medium mb-3">Order Summary</h3>
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.totals.subtotal)}</span>
              </div>
              
              {order.totals.discountTotal > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-500">
                  <span>Discounts</span>
                  <span>-{formatCurrency(order.totals.discountTotal)}</span>
                </div>
              )}
              
              {order.totals.taxTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(order.totals.taxTotal)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {order.totals.shippingTotal > 0 ? (
                  <span>{formatCurrency(order.totals.shippingTotal)}</span>
                ) : (
                  <span className="text-green-600 dark:text-green-500">Free</span>
                )}
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer Notes */}
        {order.notes && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Order Notes</h3>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-sm">{order.notes}</p>
              </div>
            </div>
          </>
        )}
        
        {/* What's Next */}
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">What's Next?</h3>
          <ol className="space-y-2 text-sm pl-5 list-decimal">
            <li>You will receive an order confirmation email shortly.</li>
            <li>Our team will prepare your order for shipment.</li>
            <li>You'll receive another email with tracking information once your order ships.</li>
            <li>Your order should arrive by {
              order.estimatedDelivery ? 
                format(new Date(order.estimatedDelivery), 'MMMM d, yyyy') : 
                'the estimated delivery date'
              }.
            </li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button variant="outline" asChild>
          <Link href="/account/orders">
            View My Orders
          </Link>
        </Button>
        
        <Button asChild onClick={handleContinueShopping}>
          <Link href="/products">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
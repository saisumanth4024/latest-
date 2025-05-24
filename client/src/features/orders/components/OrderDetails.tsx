import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { format } from 'date-fns';
import {
  useGetOrderDetailsQuery,
  usePollOrderTrackingQuery,
  useGetOrderInvoiceQuery,
  useDownloadInvoicePdfQuery,
  useSubmitCancellationRequestMutation,
} from '../ordersApi';
import { useDispatch } from 'react-redux';
import { setActiveOrder } from '../ordersSlice';
import { OrderStatus, CancellationReason, OrderTrackingStatus } from '@/types/order';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Loader2,
  MapPin,
  Phone,
  Printer,
  Truck,
  User,
  Package,
  XCircle,
  AlertCircle,
  CheckCircle,
  CreditCard,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

// Helper component for tracking status
const OrderTrackingStatusComponent = ({ status }: { status: OrderTrackingStatus }) => {
  // Function to determine progress percentage based on status
  const getProgressPercentage = (status: OrderTrackingStatus) => {
    const statusOrder = [
      OrderTrackingStatus.PENDING,
      OrderTrackingStatus.PROCESSING,
      OrderTrackingStatus.PACKED,
      OrderTrackingStatus.SHIPPED,
      OrderTrackingStatus.OUT_FOR_DELIVERY,
      OrderTrackingStatus.DELIVERED,
    ];
    
    const index = statusOrder.indexOf(status);
    if (index === -1) return 0;
    return Math.round((index / (statusOrder.length - 1)) * 100);
  };
  
  const getStatusColor = (status: OrderTrackingStatus) => {
    switch (status) {
      case OrderTrackingStatus.DELIVERED:
        return 'text-green-600 dark:text-green-500';
      case OrderTrackingStatus.CANCELED:
      case OrderTrackingStatus.RETURNED:
        return 'text-red-600 dark:text-red-500';
      default:
        return 'text-primary';
    }
  };
  
  const progress = getProgressPercentage(status);
  const statusColor = getStatusColor(status);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Order Placed</span>
        <span>Delivered</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-center mt-2">
        <span className={`text-sm font-medium ${statusColor}`}>
          {status === OrderTrackingStatus.PENDING && 'Order Received'}
          {status === OrderTrackingStatus.PROCESSING && 'Processing Order'}
          {status === OrderTrackingStatus.PACKED && 'Order Packed'}
          {status === OrderTrackingStatus.SHIPPED && 'Order Shipped'}
          {status === OrderTrackingStatus.OUT_FOR_DELIVERY && 'Out for Delivery'}
          {status === OrderTrackingStatus.DELIVERED && 'Delivered'}
          {status === OrderTrackingStatus.CANCELED && 'Order Canceled'}
          {status === OrderTrackingStatus.RETURNED && 'Order Returned'}
        </span>
      </div>
    </div>
  );
};

// Helper component for status badge
const StatusBadge = ({ status }: { status: OrderStatus | OrderTrackingStatus }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
      case OrderTrackingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case OrderStatus.CONFIRMED:
      case OrderTrackingStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case OrderTrackingStatus.PACKED:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case OrderStatus.SHIPPED:
      case OrderTrackingStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case OrderTrackingStatus.OUT_FOR_DELIVERY:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-500';
      case OrderStatus.DELIVERED:
      case OrderTrackingStatus.DELIVERED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case OrderStatus.CANCELED:
      case OrderTrackingStatus.CANCELED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case OrderStatus.RETURNED:
      case OrderTrackingStatus.RETURNED:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500';
      case OrderStatus.REFUNDED:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  
  return (
    <Badge className={`font-medium ${getStatusStyles(status)}`} variant="outline">
      {statusLabel}
    </Badge>
  );
};

// Cancellation Dialog Component
interface CancellationDialogProps {
  orderId: string;
  orderNumber: string;
  onSuccess: () => void;
}

const CancellationDialog: React.FC<CancellationDialogProps> = ({
  orderId,
  orderNumber,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<CancellationReason | ''>('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  
  const [submitCancellation, { isLoading }] = useSubmitCancellationRequestMutation();
  
  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: 'Please select a reason',
        description: 'A cancellation reason is required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await submitCancellation({
        orderId,
        reason: reason as CancellationReason,
        description,
      }).unwrap();
      
      toast({
        title: 'Cancellation Request Submitted',
        description: 'Your cancellation request has been submitted successfully.',
      });
      
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'There was an error submitting your cancellation request. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 dark:text-red-500">
          <XCircle className="h-4 w-4 mr-2" />
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Order #{orderNumber}</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancellation. This information helps us improve our service.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Cancellation*</label>
            <Select
              value={reason}
              onValueChange={(value) => setReason(value as CancellationReason)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cancellation Reason</SelectLabel>
                  <SelectItem value={CancellationReason.FOUND_BETTER_PRICE}>Found better price elsewhere</SelectItem>
                  <SelectItem value={CancellationReason.CHANGED_MIND}>Changed my mind</SelectItem>
                  <SelectItem value={CancellationReason.PURCHASED_BY_MISTAKE}>Purchased by mistake</SelectItem>
                  <SelectItem value={CancellationReason.SHIPPING_TAKING_TOO_LONG}>Shipping taking too long</SelectItem>
                  <SelectItem value={CancellationReason.DELIVERY_DATE_TOO_LATE}>Delivery date too late</SelectItem>
                  <SelectItem value={CancellationReason.ORDER_CREATED_BY_MISTAKE}>Order created by mistake</SelectItem>
                  <SelectItem value={CancellationReason.ITEM_NOT_NEEDED_ANYMORE}>Items not needed anymore</SelectItem>
                  <SelectItem value={CancellationReason.OTHER}>Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Comments (Optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide any additional details about your cancellation request..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading || !reason}
            className="ml-2"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Return request component for individual items (will be shown in a future PR)
interface ReturnItemProps {
  itemId: string;
  orderId: string;
  onSuccess: () => void;
}

const ReturnItemButton: React.FC<ReturnItemProps> = ({ itemId, orderId, onSuccess }) => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`/orders/${orderId}/return/${itemId}`}>
        Return Item
      </Link>
    </Button>
  );
};

// Main OrderDetails component
export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Set active order in Redux for other components to use
  React.useEffect(() => {
    if (id) {
      dispatch(setActiveOrder(id));
    }
    
    // Cleanup when component unmounts
    return () => {
      dispatch(setActiveOrder(''));
    };
  }, [id, dispatch]);
  
  // Fetch order details
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useGetOrderDetailsQuery(id as string, {
    skip: !id,
  });
  
  // Poll for tracking updates if order is active
  const isActiveOrder = orderData?.order.status !== OrderStatus.DELIVERED && 
                       orderData?.order.status !== OrderStatus.CANCELED &&
                       orderData?.order.status !== OrderStatus.RETURNED;
  
  const {
    data: trackingData,
  } = usePollOrderTrackingQuery(
    {
      orderId: id as string,
      interval: 60000, // Poll every minute for active orders
    },
    {
      skip: !id || !isActiveOrder,
    }
  );
  
  // Get invoice data
  const { data: invoiceData } = useGetOrderInvoiceQuery(id as string, {
    skip: !id || !orderData?.order,
  });
  
  // Handle download invoice
  const { refetch: downloadInvoice, isFetching: isDownloading } = useDownloadInvoicePdfQuery(id as string, {
    skip: true, // Don't fetch automatically, we'll trigger this manually
  });
  
  const handleDownloadInvoice = async () => {
    try {
      const { data } = await downloadInvoice();
      if (data) {
        // Create a download link
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${orderData?.order.orderNumber || id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download invoice. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle successful cancellation
  const handleCancellationSuccess = () => {
    // Refetch order details
    refetchOrder();
  };
  
  // Error state
  if (orderError) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-xl mb-2">Error Loading Order</CardTitle>
            <CardDescription className="mb-4">
              There was a problem loading this order. Please try again.
            </CardDescription>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/orders">Back to Orders</Link>
              </Button>
              <Button onClick={() => refetchOrder()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Loading state
  if (isOrderLoading || !orderData) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-muted animate-pulse"></div>
          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
        </div>
        
        <div className="space-y-4">
          <div className="h-8 w-60 bg-muted animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border h-40 p-4 space-y-4">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-3/4 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
            <div className="rounded-lg border h-40 p-4 space-y-4">
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-3/4 bg-muted animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { order, tracking, invoice, returnRequests, cancellationRequest } = orderData;
  const currentTracking = trackingData?.tracking || tracking;
  
  // Determine if order can be canceled
  const canCancel = [
    OrderStatus.PENDING, 
    OrderStatus.CONFIRMED
  ].includes(order.status) && !cancellationRequest;
  
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.placedAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      
      {/* Order Tracking */}
      {currentTracking && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <OrderTrackingStatusComponent status={currentTracking.status} />
            
            {currentTracking.trackingNumber && (
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Tracking Number</p>
                    <p className="text-sm font-mono">{currentTracking.trackingNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Carrier: {currentTracking.carrier}
                    </p>
                  </div>
                  {currentTracking.trackingUrl && (
                    <Button asChild>
                      <a href={currentTracking.trackingUrl} target="_blank" rel="noopener noreferrer">
                        Track Package
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {currentTracking.estimatedDelivery && (
              <div className="text-sm">
                <span className="font-medium">Estimated Delivery: </span>
                {format(new Date(currentTracking.estimatedDelivery), 'MMMM d, yyyy')}
              </div>
            )}
            
            {/* Tracking history updates */}
            {currentTracking.updates.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tracking-history">
                  <AccordionTrigger>Tracking History</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {currentTracking.updates.map((update, index) => (
                        <div key={update.id} className="relative pl-6 pb-4">
                          {/* Timeline connector */}
                          {index < currentTracking.updates.length - 1 && (
                            <div className="absolute top-2 left-[9px] bottom-0 w-0.5 bg-muted-foreground/20"></div>
                          )}
                          
                          {/* Status dot */}
                          <div className="absolute top-2 left-0 w-[19px] h-[19px] rounded-full border-2 border-primary bg-background flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-medium">
                              <StatusBadge status={update.status} />
                            </p>
                            <p className="text-sm">{update.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(update.timestamp), 'MMM d, yyyy - h:mm a')}
                              {update.location && ` • ${update.location}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Order Info Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Billing</TabsTrigger>
        </TabsList>
        
        {/* Order Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Order Number</dt>
                    <dd className="text-sm font-medium">{order.orderNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Order Date</dt>
                    <dd className="text-sm font-medium">
                      {format(new Date(order.placedAt), 'MMMM d, yyyy')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="text-sm font-medium">
                      <StatusBadge status={order.status} />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Payment Method</dt>
                    <dd className="text-sm font-medium">{order.billing.paymentMethod}</dd>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-muted-foreground">Estimated Delivery</dt>
                      <dd className="text-sm font-medium">
                        {format(new Date(order.estimatedDelivery), 'MMMM d, yyyy')}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
            
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Subtotal</dt>
                    <dd className="text-sm font-medium">{formatCurrency(order.billing.subtotal)}</dd>
                  </div>
                  {order.billing.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-500">
                      <dt className="text-sm">Discount</dt>
                      <dd className="text-sm font-medium">-{formatCurrency(order.billing.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Shipping</dt>
                    <dd className="text-sm font-medium">
                      {order.billing.shipping > 0
                        ? formatCurrency(order.billing.shipping)
                        : 'Free'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Tax</dt>
                    <dd className="text-sm font-medium">{formatCurrency(order.billing.tax)}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <dt className="text-sm">Total</dt>
                    <dd className="text-sm">{formatCurrency(order.billing.total)}</dd>
                  </div>
                </dl>
              </CardContent>
              
              {invoice && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadInvoice}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download Invoice
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-end">
            {/* Support button */}
            <Button variant="outline" asChild>
              <Link href="/support?order={order.id}">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            
            {/* Cancellation button (only show if order can be canceled) */}
            {canCancel && (
              <CancellationDialog
                orderId={order.id}
                orderNumber={order.orderNumber}
                onSuccess={handleCancellationSuccess}
              />
            )}
          </div>
        </TabsContent>
        
        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            {item.options && Object.keys(item.options).length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {Object.entries(item.options)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                      <TableCell className="text-right">
                        {item.returnStatus ? (
                          <StatusBadge status={item.returnStatus} />
                        ) : (
                          <StatusBadge status={item.status} />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === OrderStatus.DELIVERED && 
                         !item.returnStatus && 
                         !cancellationRequest && (
                          <ReturnItemButton
                            itemId={item.id}
                            orderId={order.id}
                            onSuccess={refetchOrder}
                          />
                        )}
                        {order.status !== OrderStatus.DELIVERED && 
                         !item.returnStatus && 
                         item.product.reviewUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a 
                              href={item.product.reviewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View Product
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Shipping & Billing Tab */}
        <TabsContent value="shipping" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p className="font-medium">
                    {order.shipping.address.firstName} {order.shipping.address.lastName}
                  </p>
                  {order.shipping.address.company && (
                    <p>{order.shipping.address.company}</p>
                  )}
                  <p>{order.shipping.address.address1}</p>
                  {order.shipping.address.address2 && (
                    <p>{order.shipping.address.address2}</p>
                  )}
                  <p>
                    {order.shipping.address.city}, {order.shipping.address.state}{' '}
                    {order.shipping.address.postcode}
                  </p>
                  <p>{order.shipping.address.country}</p>
                  <p className="mt-2">
                    <span className="font-medium">Phone: </span>
                    {order.shipping.address.phone}
                  </p>
                  {order.shipping.address.email && (
                    <p>
                      <span className="font-medium">Email: </span>
                      {order.shipping.address.email}
                    </p>
                  )}
                </address>
              </CardContent>
            </Card>
            
            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p className="font-medium">
                    {order.billing.address.firstName} {order.billing.address.lastName}
                  </p>
                  {order.billing.address.company && (
                    <p>{order.billing.address.company}</p>
                  )}
                  <p>{order.billing.address.address1}</p>
                  {order.billing.address.address2 && (
                    <p>{order.billing.address.address2}</p>
                  )}
                  <p>
                    {order.billing.address.city}, {order.billing.address.state}{' '}
                    {order.billing.address.postcode}
                  </p>
                  <p>{order.billing.address.country}</p>
                  <p className="mt-2">
                    <span className="font-medium">Phone: </span>
                    {order.billing.address.phone}
                  </p>
                  {order.billing.address.email && (
                    <p>
                      <span className="font-medium">Email: </span>
                      {order.billing.address.email}
                    </p>
                  )}
                </address>
              </CardContent>
            </Card>
          </div>
          
          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shipping.method}</p>
              {order.shipping.cost > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Cost: {formatCurrency(order.shipping.cost)}
                </p>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-500">
                  Free Shipping
                </p>
              )}
              {order.shipping.estimatedDelivery && (
                <p className="text-sm mt-2">
                  <span className="font-medium">Estimated Delivery: </span>
                  {format(
                    new Date(order.shipping.estimatedDelivery),
                    'MMMM d, yyyy'
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
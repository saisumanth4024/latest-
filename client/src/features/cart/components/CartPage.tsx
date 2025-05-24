import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchCart, removeFromCart, updateQuantity, saveForLater, moveToCart, clearCart } from '../cartSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Trash,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { cart, savedItems, status, error } = useAppSelector((state: RootState) => state.cart);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch cart on component mount
    dispatch(fetchCart() as any);
  }, [dispatch]);

  const handleRemoveItem = (itemId: string | number) => {
    dispatch(removeFromCart(itemId));
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  };

  const handleUpdateQuantity = (itemId: string | number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity }));
  };

  const handleSaveForLater = (itemId: string | number) => {
    dispatch(saveForLater(itemId));
    toast({
      title: 'Item saved',
      description: 'The item has been saved for later.',
    });
  };

  const handleMoveToCart = (itemId: string | number) => {
    dispatch(moveToCart(itemId));
    toast({
      title: 'Item moved to cart',
      description: 'The item has been moved to your cart.',
    });
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart.',
    });
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="flex flex-col space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-gray-200 h-96 rounded animate-pulse"></div>
            </div>
            <div className="md:col-span-1">
              <div className="bg-gray-200 h-64 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading your cart. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <Card className="text-center p-8">
          <CardContent className="pt-6 flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">Your cart is empty</CardTitle>
            <CardDescription className="mb-6">
              Looks like you haven't added any products to your cart yet.
            </CardDescription>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>

        {savedItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Saved for Later ({savedItems.length})</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-16 w-16 bg-gray-100 rounded mr-4 flex items-center justify-center">
                              {item.product.imageUrl ? (
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <ShoppingBag className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-muted-foreground">{item.product.brand?.name || "Unknown Brand"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveToCart(item.id)}
                            >
                              Move to Cart
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Populated cart
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cart.items.length})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-20 w-20 bg-gray-100 rounded mr-4 flex items-center justify-center">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <ShoppingBag className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.brand?.name || 'Unknown Brand'}
                              {item.options && Object.entries(item.options).length > 0 && (
                                <div className="mt-1">
                                  {Object.entries(item.options).map(([key, value]) => (
                                    <span key={key} className="text-xs">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                            className="w-12 h-8 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatCurrency(item.subtotal)}</div>
                          {item.discountTotal > 0 && (
                            <div className="text-sm text-green-600">
                              Save {formatCurrency(item.discountTotal)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveForLater(item.id)}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>

          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Saved for Later ({savedItems.length})</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-16 w-16 bg-gray-100 rounded mr-4 flex items-center justify-center">
                                {item.product.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                ) : (
                                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{item.product.name}</div>
                                <div className="text-sm text-muted-foreground">{item.product.brand?.name || "Unknown Brand"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMoveToCart(item.id)}
                              >
                                Move to Cart
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.totals.subtotal)}</span>
                </div>
                
                {cart.totals.discountTotal > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(cart.totals.discountTotal)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {cart.totals.shippingTotal === 0 
                      ? 'Free' 
                      : formatCurrency(cart.totals.shippingTotal)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(cart.totals.taxTotal)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(cart.totals.total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
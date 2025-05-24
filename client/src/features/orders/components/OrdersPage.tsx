import React from 'react';
import { Switch, Route, useRoute } from 'wouter';
import { Container } from '@/components/ui/container';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import ReturnItemForm from './ReturnItemForm';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

// Login prompt for unauthenticated users
const LoginPrompt = () => (
  <Card className="mt-8">
    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
      <ShoppingBag className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
      <CardTitle className="text-xl mb-2">Login Required</CardTitle>
      <CardDescription className="mb-6 max-w-md">
        You need to be logged in to view your orders. Please log in to continue.
      </CardDescription>
      <Button asChild>
        <a href="/api/login">Log in with Replit</a>
      </Button>
    </CardContent>
  </Card>
);

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isOrdersRoute] = useRoute('/orders');
  const [isOrderDetailsRoute] = useRoute('/orders/:id');
  const [isReturnRoute] = useRoute('/orders/:orderId/return/:itemId');
  
  // Show loading state
  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </Container>
    );
  }

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Container>
        <LoginPrompt />
      </Container>
    );
  }
  
  return (
    <Container>
      <Switch>
        <Route path="/orders" component={OrderList} />
        <Route path="/orders/:id" component={OrderDetails} />
        <Route path="/orders/:orderId/return/:itemId" component={ReturnItemForm} />
      </Switch>
    </Container>
  );
}
import React from 'react';
import { Switch, Route, useRoute } from 'wouter';
import { Container } from '@/components/ui/container';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import ReturnItemForm from './ReturnItemForm';

export default function OrdersPage() {
  const [isOrdersRoute] = useRoute('/orders');
  const [isOrderDetailsRoute] = useRoute('/orders/:id');
  const [isReturnRoute] = useRoute('/orders/:orderId/return/:itemId');
  
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
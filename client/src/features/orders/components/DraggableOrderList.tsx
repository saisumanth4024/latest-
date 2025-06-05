import React, { useState } from 'react';
import { Link } from '@/router/wouterCompat';
import { format } from 'date-fns';
import {
  DndContext, 
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import { Order } from '@/types/order';
import { useToast } from '@/hooks/use-toast';

// Helper function to get status badge
const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case OrderStatus.PROCESSING:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case OrderStatus.CANCELED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case OrderStatus.RETURNED:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500';
      case OrderStatus.REFUNDED:
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <Badge className={`font-medium ${getStatusStyles(status)}`} variant="outline">
      {statusLabel}
    </Badge>
  );
};

// Sortable order row component
interface SortableOrderRowProps {
  order: Order;
  id: string;
}

function SortableOrderRow({ order, id }: SortableOrderRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as 'relative',
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style}
      className={isDragging ? 'bg-muted/20' : ''}
    >
      <TableCell>
        <div
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted/20 rounded-md inline-flex items-center justify-center"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {order.orderNumber}
      </TableCell>
      <TableCell>
        {format(new Date(order.placedAt), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>{order.items.length}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(order.billing.total)}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" asChild size="sm">
          <Link href={`/orders/${order.id}`}>View Details</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

interface DraggableOrderListProps {
  orders: Order[];
  onOrdersReordered?: (orders: Order[]) => void;
}

export function DraggableOrderList({ orders, onOrdersReordered }: DraggableOrderListProps) {
  const [items, setItems] = useState(orders);
  const { toast } = useToast();

  // Setup the sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px of movement required before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle the end of a drag event
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        // Find the old and new indices
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        // Create the new array with reordered items
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        
        // Call the callback if provided
        if (onOrdersReordered) {
          onOrdersReordered(reorderedItems);
        }

        // Show success toast
        toast({
          title: "Order prioritized",
          description: `Order ${items[oldIndex].orderNumber} has been moved ${newIndex > oldIndex ? 'down' : 'up'} in your list.`,
          variant: "default",
        });
        
        return reorderedItems;
      });
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Order #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext 
            items={items.map(order => order.id)} 
            strategy={verticalListSortingStrategy}
          >
            {items.map((order) => (
              <SortableOrderRow
                key={order.id}
                id={order.id}
                order={order}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
import { Request, Response } from 'express';
import { OrderStatus } from '../../client/src/types/order';

// Order status options for random distribution
const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'canceled',
  'returned',
  'refunded',
];

// Generate a random order for demo purposes
const generateOrder = (id: number) => {
  const orderDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
  const itemCount = Math.floor(Math.random() * 5) + 1;
  const itemsTotal = (Math.random() * 100 * itemCount).toFixed(2);
  const shipping = (Math.random() * 15).toFixed(2);
  const tax = (parseFloat(itemsTotal) * 0.07).toFixed(2);
  const total = (parseFloat(itemsTotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);
  
  return {
    id: id.toString(),
    orderNumber: `ORD-${10000 + id}`,
    placedAt: orderDate.toISOString(),
    status: ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)],
    customer: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    shipping: {
      address: {
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
      },
      method: "Standard Shipping",
      cost: parseFloat(shipping),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    billing: {
      address: {
        line1: "123 Main St",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
      },
      paymentMethod: "Credit Card",
      subtotal: parseFloat(itemsTotal),
      shipping: parseFloat(shipping),
      tax: parseFloat(tax),
      total: parseFloat(total),
    },
    items: Array(itemCount).fill(0).map((_, idx) => ({
      id: `item-${id}-${idx}`,
      productId: `product-${Math.floor(Math.random() * 100)}`,
      name: `Product ${Math.floor(Math.random() * 100)}`,
      description: "Product description text here",
      price: parseFloat((Math.random() * 50).toFixed(2)),
      quantity: Math.floor(Math.random() * 3) + 1,
      imageUrl: `https://picsum.photos/seed/${id}-${idx}/200/200`,
    })),
  };
};

// Handle GET request for orders
export const getOrders = (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    // Generate 50 sample orders
    let orders = Array(50).fill(0).map((_, idx) => generateOrder(idx + 1));
    
    // Apply filters if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      orders = orders.filter(order => new Date(order.placedAt) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      orders = orders.filter(order => new Date(order.placedAt) <= end);
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
    
    // Calculate pagination
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / pageSize);
    const paginatedOrders = orders.slice((page - 1) * pageSize, page * pageSize);
    
    // Return paginated response
    res.json({
      orders: paginatedOrders,
      page,
      pageSize,
      totalOrders,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Handle GET request for a single order
export const getOrderDetails = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId) || orderId < 1 || orderId > 50) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = generateOrder(orderId);
    
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

// Handle GET request for order tracking
export const getOrderTracking = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId) || orderId < 1 || orderId > 50) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = generateOrder(orderId);
    const events = [];
    const now = new Date();
    
    // Generate tracking events based on order status
    if (order.status === 'delivered') {
      events.push({
        status: 'Delivered',
        location: 'Customer Address',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package was delivered',
      });
    }
    
    if (order.status === 'delivered' || order.status === 'shipped') {
      events.push({
        status: 'Out for delivery',
        location: 'Local Distribution Center',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package is out for delivery',
      });
      
      events.push({
        status: 'Arrived at distribution center',
        location: 'Distribution Center',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package arrived at local distribution center',
      });
    }
    
    if (order.status === 'delivered' || order.status === 'shipped' || order.status === 'processing') {
      events.push({
        status: 'Shipped',
        location: 'Fulfillment Center',
        timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Package has been shipped',
      });
    }
    
    if (order.status !== 'pending') {
      events.push({
        status: 'Processing',
        location: 'Fulfillment Center',
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order is being processed',
      });
    }
    
    // Always include order placed
    events.push({
      status: 'Order placed',
      location: 'Online',
      timestamp: order.placedAt,
      description: 'Order has been placed',
    });
    
    // Sort events by timestamp (newest first)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: `TRK-${10000 + orderId}`,
      carrier: 'FastShip',
      estimatedDelivery: order.shipping.estimatedDelivery,
      events,
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    res.status(500).json({ message: 'Failed to fetch order tracking' });
  }
};

// Handle GET request for order invoice
export const getOrderInvoice = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId) || orderId < 1 || orderId > 50) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = generateOrder(orderId);
    
    res.json({
      invoiceId: `INV-${10000 + orderId}`,
      orderNumber: order.orderNumber,
      invoiceDate: order.placedAt,
      dueDate: order.placedAt, // Same as order date for this demo
      customer: order.customer,
      items: order.items,
      billing: order.billing,
      paymentStatus: 'Paid',
    });
  } catch (error) {
    console.error('Error fetching order invoice:', error);
    res.status(500).json({ message: 'Failed to fetch order invoice' });
  }
};
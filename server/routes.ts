import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getOrders, getOrderDetails, getOrderTracking, getOrderInvoice } from "./routes/orders";
import { 
  getProducts, 
  getProductById, 
  getProductsByCategory, 
  searchProducts, 
  getFeaturedProducts, 
  getNewArrivals, 
  getBestSellers, 
  getProductRecommendations 
} from "./routes/products";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For demo purposes, return a mock admin user
      res.json({
        id: "1", 
        role: "admin",
        email: "admin@example.com",
        firstName: "John",
        lastName: "Doe",
        profileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg"
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // API Status endpoint
  app.get('/api/status', (req, res) => {
    res.json([
      {
        id: 1,
        name: "Authentication Service",
        status: "operational",
        uptime: 99.98,
        lastIncident: "2023-11-15T08:12:33Z"
      },
      {
        id: 2,
        name: "Order Processing",
        status: "operational",
        uptime: 99.95,
        lastIncident: "2023-12-01T14:22:10Z"
      },
      {
        id: 3,
        name: "Payment Gateway",
        status: "operational",
        uptime: 99.99,
        lastIncident: "2023-10-05T03:45:17Z"
      },
      {
        id: 4,
        name: "Product Catalog",
        status: "operational",
        uptime: 100,
        lastIncident: null
      }
    ]);
  });

  // API Metrics endpoint
  app.get('/api/metrics', (req, res) => {
    res.json({
      totalUsers: 12435,
      apiRequests: 45300000,
      avgResponseTime: 128,
      errorRate: 0.05,
      lastUpdated: new Date().toISOString()
    });
  });

  // API Activities endpoint
  app.get('/api/activities', (req, res) => {
    res.json([
      {
        id: 1,
        endpoint: "/api/users",
        method: "GET",
        count: 234567,
        avgResponseTime: 85,
        errorRate: 0.02
      },
      {
        id: 2,
        endpoint: "/api/products",
        method: "GET",
        count: 789012,
        avgResponseTime: 102,
        errorRate: 0.01
      },
      {
        id: 3,
        endpoint: "/api/orders",
        method: "POST",
        count: 45678,
        avgResponseTime: 145,
        errorRate: 0.08
      },
      {
        id: 4,
        endpoint: "/api/auth",
        method: "POST",
        count: 123456,
        avgResponseTime: 110,
        errorRate: 0.03
      }
    ]);
  });

  // Notifications endpoint
  app.get('/api/notifications', (req, res) => {
    res.json({
      unread: 5,
      notifications: [
        {
          id: "1",
          type: "info",
          title: "Welcome to the dashboard",
          message: "Take a tour of the new features",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: "2",
          type: "success",
          title: "Order #12345 shipped",
          message: "Your order has been shipped and will arrive in 2-3 business days",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: "3",
          type: "warning",
          title: "Subscription expiring soon",
          message: "Your subscription will expire in 3 days",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: "4",
          type: "error",
          title: "Payment failed",
          message: "We couldn't process your last payment",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: "5",
          type: "info",
          title: "New feature available",
          message: "Check out our new reporting dashboard",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: "6",
          type: "success",
          title: "Account verified",
          message: "Your account has been successfully verified",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ]
    });
  });

  // Orders API routes
  app.get('/api/orders', getOrders);
  app.get('/api/orders/:id', getOrderDetails);
  app.get('/api/orders/:id/tracking', getOrderTracking);
  app.get('/api/orders/:id/invoice', getOrderInvoice);

  // Products API routes
  app.get('/api/products', getProducts);
  app.get('/api/products/:id', getProductById);
  app.get('/api/products/category/:category', getProductsByCategory);
  app.get('/api/products/search', searchProducts);
  app.get('/api/products/featured', getFeaturedProducts);
  app.get('/api/products/new-arrivals', getNewArrivals);
  app.get('/api/products/best-sellers', getBestSellers);
  app.get('/api/products/:id/recommendations', getProductRecommendations);

  const httpServer = createServer(app);
  return httpServer;
}
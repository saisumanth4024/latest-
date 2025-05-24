import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  // Traditional login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Mock users for demonstration
      const mockUsers = [
        {
          id: '1',
          email: 'admin@example.com',
          password: 'password123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
          createdAt: new Date(2023, 0, 1).toISOString(),
          updatedAt: new Date(2023, 0, 1).toISOString()
        },
        {
          id: '2',
          email: 'user@example.com',
          password: 'password123',
          firstName: 'Regular',
          lastName: 'User',
          role: 'user',
          profileImageUrl: 'https://ui-avatars.com/api/?name=Regular+User&background=4CAF50&color=fff',
          createdAt: new Date(2023, 1, 15).toISOString(),
          updatedAt: new Date(2023, 1, 15).toISOString()
        },
        {
          id: '3',
          email: 'seller@example.com',
          password: 'password123',
          firstName: 'Seller',
          lastName: 'User',
          role: 'seller',
          profileImageUrl: 'https://ui-avatars.com/api/?name=Seller+User&background=FF9800&color=fff',
          createdAt: new Date(2023, 2, 10).toISOString(),
          updatedAt: new Date(2023, 2, 10).toISOString()
        }
      ];
      
      // Find user by email
      const user = mockUsers.find(u => u.email === email);
      
      // Check if user exists and password matches
      if (user && password === 'password123') {
        // Remove password before sending response
        const { password, ...userWithoutPassword } = user;
        
        // Generate a simple token
        const token = `mock-jwt-token-${user.id}-${Date.now()}`;
        
        res.json({
          user: userWithoutPassword,
          token,
          refreshToken: `refresh-${token}`,
          expiresAt: Date.now() + 3600000 // 1 hour from now
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  });
  
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // API Routes
  
  // Get metrics
  app.get('/api/metrics', async (req, res) => {
    res.json({
      totalUsers: 12435,
      apiRequests: 45300000,
      avgResponseTime: 238,
      errorRate: 0.12
    });
  });

  // Get API activities
  app.get('/api/activities', async (req, res) => {
    const activities = [
      { id: 1, endpoint: '/api/users', method: 'GET', status: 200, time: '5m ago' },
      { id: 2, endpoint: '/api/products', method: 'POST', status: 201, time: '12m ago' },
      { id: 3, endpoint: '/api/auth', method: 'POST', status: 401, time: '15m ago' },
      { id: 4, endpoint: '/api/orders/123', method: 'PUT', status: 200, time: '20m ago' },
      { id: 5, endpoint: '/api/users/456', method: 'DELETE', status: 204, time: '25m ago' },
    ];
    res.json(activities);
  });

  // Get API status
  app.get('/api/status', async (req, res) => {
    const statuses = [
      { id: 1, name: 'Authentication Service', status: 'operational' },
      { id: 2, name: 'User Management API', status: 'operational' },
      { id: 3, name: 'Data Processing Service', status: 'degraded' },
      { id: 4, name: 'Storage Service', status: 'operational' },
      { id: 5, name: 'Notification Service', status: 'operational' },
    ];
    res.json(statuses);
  });

  // Create user endpoint (using upsertUser instead of createUser)
  app.post('/api/users', async (req, res) => {
    try {
      // With Replit auth, we don't need to create users directly
      // Users are created via Replit authentication flow
      res.status(201).json({ 
        success: true, 
        message: 'Users are now managed through Replit authentication' 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Could not process request' });
    }
  });

  // Deploy API endpoint
  app.post('/api/deploy', async (req, res) => {
    // Simulate deployment process
    setTimeout(() => {
      res.json({ success: true });
    }, 1000);
  });

  // View logs endpoint
  app.get('/api/logs', async (req, res) => {
    const logs = [
      '[2023-07-01 12:34:56] INFO: System startup',
      '[2023-07-01 12:35:23] INFO: User login - user123',
      '[2023-07-01 12:36:45] ERROR: Database connection failed',
      '[2023-07-01 12:37:12] INFO: Database connection restored',
      '[2023-07-01 12:38:56] WARN: High memory usage detected'
    ];
    res.json(logs);
  });

  // Configure rules endpoint
  app.post('/api/configure', async (req, res) => {
    // Simulate configuration process
    setTimeout(() => {
      res.json({ success: true });
    }, 1000);
  });

  // Refresh data endpoint
  app.post('/api/refresh', async (req, res) => {
    // Just return success since all queries will refetch data
    res.json({ success: true });
  });

  // Export data endpoint
  app.get('/api/export', async (req, res) => {
    // Create a simple CSV string
    const csv = `Metric,Value
Total Users,12435
API Requests,45300000
Avg Response Time,238ms
Error Rate,0.12%`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard-export.csv');
    res.send(csv);
  });

  const httpServer = createServer(app);

  return httpServer;
}

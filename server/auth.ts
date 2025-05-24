import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// User type definition
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Extend Express Request type to include user and authentication
declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated: () => boolean;
    }
  }
}

// Setup session middleware
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-do-not-use-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// Initialize custom authentication
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  
  // Session setup
  app.use((req: any, _res, next) => {
    if (req.session.user) {
      req.user = req.session.user;
      req.isAuthenticated = () => true;
    } else {
      req.isAuthenticated = () => false;
    }
    next();
  });

  // Handle login
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
        // Remove password before storing in session
        const { password, ...userWithoutPassword } = user;
        
        // Store user in session
        req.session.user = userWithoutPassword;
        
        // Generate a simple token
        const token = `mock-jwt-token-${user.id}-${Date.now()}`;
        req.session.token = token;
        
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

  // Logout route
  app.get("/api/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      // Redirect to the login page after logout
      res.redirect('/login');
    });
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
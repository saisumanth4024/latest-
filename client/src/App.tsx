import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import LoginPage from "@/pages/LoginPage";
import Layout from "@/components/layout/Layout";
import ProfilePageLegacy from "@/pages/ProfilePage";
import ProfilePage from "@/features/profile/ProfilePage";
import { UserRole } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { fetchCart } from "@/features/cart/cartSlice";

// Define placeholder components for routes that don't have implementations yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title} Page</h1>
    <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
  </div>
);

// Import the product pages components
import { ProductsPage as ProductsPageImpl, ProductDetailPage } from "@/features/products";

// Import cart and wishlist pages
import CartPage from "@/features/cart/components/CartPage";
import WishlistPage from "@/features/wishlist/components/WishlistPage";

// Import checkout page
import Checkout from "@/features/checkout/components/Checkout";

// Import reviews pages
import { ReviewsPage, ModerationPage } from "@/features/reviews/pages";

// Create components for each route
const ProductsPlaceholder = () => <PlaceholderPage title="Products" />;
import OrdersPage from '@/features/orders/components/OrdersPage';
import SearchResults from '@/features/search/pages/SearchResults';
import { DashboardPage } from '@/features/dashboard';
const AnalyticsPage = () => <DashboardPage />;
const SettingsPage = () => <PlaceholderPage title="Settings" />;
const AdminDashboardPage = () => <PlaceholderPage title="Admin Dashboard" />;
const SellerDashboardPage = () => <PlaceholderPage title="Seller Dashboard" />;

// Create a central routes configuration with auth requirements
export const routes = [
  {
    path: "/",
    component: Dashboard,
    exact: true,
    requireAuth: false,
    title: "Dashboard",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  {
    path: "/login",
    component: LoginPage,
    requireAuth: false,
    title: "Login",
    hideInMenu: true,
    roles: ['guest'] as UserRole[],
  },
  { 
    path: "/products", 
    component: ProductsPageImpl, 
    requireAuth: false,
    title: "Products",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[]
  },
  {
    path: "/products/:productId",
    component: ProductDetailPage,
    requireAuth: false,
    title: "Product Details",
    hideInMenu: true,
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  {
    path: "/cart",
    component: CartPage,
    requireAuth: false,
    title: "Cart",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[]
  },
  {
    path: "/checkout",
    component: Checkout,
    requireAuth: false,
    title: "Checkout",
    hideInMenu: true,
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  {
    path: "/wishlists",
    component: WishlistPage,
    requireAuth: true,
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
    title: "Wishlists"
  },
  { 
    path: "/orders", 
    component: OrdersPage, 
    requireAuth: true,
    title: "Orders",
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[]
  },
  { 
    path: "/search", 
    component: SearchResults, 
    requireAuth: false,
    title: "Search",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[]
  },
  { 
    path: "/analytics", 
    component: AnalyticsPage, 
    requireAuth: true,
    title: "Analytics",
    roles: ['admin', 'seller'] as UserRole[],
  },
  { 
    path: "/profile", 
    component: ProfilePage, 
    requireAuth: true,
    title: "Profile",
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  { 
    path: "/profile-legacy", 
    component: ProfilePageLegacy, 
    requireAuth: true,
    title: "Profile (Legacy)",
    hideInMenu: true,
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  { 
    path: "/settings", 
    component: ProfilePage, 
    requireAuth: true,
    title: "Settings",
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  { 
    path: "/reviews/:contentType/:contentId", 
    component: () => (
      <ReviewsPage 
        contentType="product" 
        contentId="1" 
        title="Customer Reviews" 
      />
    ), 
    requireAuth: false,
    title: "Reviews",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[],
    hideInMenu: true,
  },
  {
    path: "/moderation/reviews",
    component: () => (<ModerationPage userId="admin" />),
    requireAuth: true,
    roles: ['admin', 'moderator'] as UserRole[],
    title: "Review Moderation",
  },
  { 
    path: "/admin/dashboard", 
    component: AdminDashboardPage, 
    requireAuth: true,
    roles: ['admin'] as UserRole[],
    title: "Admin Dashboard",
  },
  { 
    path: "/seller/dashboard", 
    component: SellerDashboardPage, 
    requireAuth: true,
    roles: ['seller', 'admin'] as UserRole[],
    title: "Seller Dashboard",
  },
  // Login and signup routes are implemented with standard forms
  { 
    path: "*", 
    component: NotFound,
    requireAuth: false,
    title: "Not Found",
    hideInMenu: true,
  }
];

// Protected Route component using Replit authentication
function ProtectedRoute({ 
  children, 
  roles 
}: { 
  children: React.ReactNode; 
  roles?: UserRole[] 
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Login Required</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          You need to be logged in to access this page. Please log in to continue.
        </p>
        <Button 
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
      </div>
    );
  }

  // If roles are specified, check if user has required role
  // Safety checks to avoid errors with undefined user or roles
  if (roles && roles.length > 0 && user) {
    // Get the user's role from the authenticated user object
    const userRole = user.role as UserRole;
    
    if (!roles.includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      navigate("/");
      return null;
    }
  }

  return <>{children}</>;
}

// Router Component that handles auth
function AppRouter() {
  // Get current path and auth status
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const noLayoutPaths: string[] = ['/'];
  const shouldShowLayout = !noLayoutPaths.includes(location) || isAuthenticated;
  
  // If we're still loading auth status, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Show landing page for non-authenticated users at root path
  if (!isAuthenticated && location === '/') {
    return <Landing />;
  }
  
  // Generate routes with the appropriate protection
  const routeElements = routes.map((route, index) => {
    // Non-auth routes or special paths
    if (!route.requireAuth || route.path === "*" || noLayoutPaths.includes(route.path)) {
      return (
        <Route 
          key={index} 
          path={route.path === "*" ? undefined : route.path} 
          component={route.component} 
        />
      );
    }
    
    // Protected routes (with roles if specified)
    return (
      <Route key={index} path={route.path}>
        <ProtectedRoute roles={route.roles}>
          {route.component && <route.component />}
        </ProtectedRoute>
      </Route>
    );
  });
  
  const content = <Switch>{routeElements}</Switch>;
  
  // Wrap with layout for most pages, except landing page for non-authenticated users
  return shouldShowLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  const dispatch = useDispatch();
  
  // Initialize cart when app starts
  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);
  
  return <AppRouter />;
}

export default App;

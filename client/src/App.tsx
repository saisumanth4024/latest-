import React, { Suspense, lazy, useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import { UserRole } from "@/config/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ErrorBoundary, { withErrorBoundary } from "@/components/ErrorBoundary";
import OfflineIndicator from "@/components/OfflineIndicator";
import NavigationToast from "@/features/navigation/NavigationToast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

// Global loading component for lazy-loaded routes
const GlobalLoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

// Lazy-loaded components for better code splitting and performance
const Landing = lazy(() => import("@/pages/Landing"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));
const ProfilePageLegacy = lazy(() => import("@/pages/ProfilePage"));
const ProductsPage = lazy(() => import("@/features/products/components/ProductsPage"));
const ProductDetailPage = lazy(() => import("@/features/products/components/ProductDetailPage"));
const ExtendedProductsPage = lazy(() => import("@/features/products/components/ExtendedProductsPage"));
const CartPage = lazy(() => import("@/features/cart/components/MockCartPage"));
const WishlistPage = lazy(() => import("@/features/wishlist/components/MockWishlistPage"));
const Checkout = lazy(() => import("@/features/checkout/components/Checkout"));
const OrdersPage = lazy(() => import('@/features/orders/components/OrdersPage'));
const SearchResults = lazy(() => import('@/features/search/pages/SearchResults'));
const DashboardPage = lazy(() => import('@/features/dashboard').then(m => ({ default: m.DashboardPage })));
const ReviewsPage = lazy(() => import("@/features/reviews/pages").then(m => ({ default: m.ReviewsPage })));
const ModerationPage = lazy(() => import("@/features/reviews/pages").then(m => ({ default: m.ModerationPage })));
const AdvancedFormPage = lazy(() => import("@/features/formsAdvanced/AdvancedFormPage"));
const TypeScriptPatternsDemo = lazy(() => import("@/features/tsPatterns/TypeScriptPatternsDemo"));

// Define placeholder components for routes that don't have implementations yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title} Page</h1>
    <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
  </div>
);

// Wrap placeholder pages in error boundaries
const AnalyticsPage = withErrorBoundary(() => <DashboardPage />, { boundary: "AnalyticsPage" });
const SettingsPage = withErrorBoundary(() => <PlaceholderPage title="Settings" />, { boundary: "SettingsPage" });
const AdminDashboardPage = withErrorBoundary(() => <PlaceholderPage title="Admin Dashboard" />, { boundary: "AdminDashboardPage" });
const SellerDashboardPage = withErrorBoundary(() => <PlaceholderPage title="Seller Dashboard" />, { boundary: "SellerDashboardPage" });

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
    path: "/forms-advanced",
    component: AdvancedFormPage,
    requireAuth: false,
    title: "Advanced Forms",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  {
    path: "/ts-patterns-demo",
    component: TypeScriptPatternsDemo,
    requireAuth: false,
    title: "TypeScript Patterns Demo",
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
    component: ProductsPage, 
    requireAuth: false,
    title: "Products",
    roles: ['guest', 'user', 'admin', 'seller', 'moderator'] as UserRole[]
  },
  { 
    path: "/extended-products", 
    component: ExtendedProductsPage, 
    requireAuth: false,
    title: "Extended Catalog",
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
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // If we're still loading auth status, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // Show landing page for non-authenticated users at root path
  if (!isAuthenticated && location === '/') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<GlobalLoadingFallback />}>
          <Landing />
          <OfflineIndicator />
        </Suspense>
      </ErrorBoundary>
    );
  }
  
  // Generate routes with the appropriate protection
  const routeElements = routes.map((route, index) => {
    // Wrap component in Suspense and ErrorBoundary
    const Component = route.component;
    const WrappedComponent = () => (
      <ErrorBoundary boundary={route.title}>
        <Suspense fallback={<GlobalLoadingFallback />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    );

    // Non-auth routes or special paths
    if (!route.requireAuth || route.path === "*" || noLayoutPaths.includes(route.path)) {
      return (
        <Route 
          key={index} 
          path={route.path === "*" ? undefined : route.path} 
          component={WrappedComponent} 
        />
      );
    }
    
    // Protected routes (with roles if specified)
    return (
      <Route key={index} path={route.path}>
        <ProtectedRoute roles={route.roles}>
          <WrappedComponent />
        </ProtectedRoute>
      </Route>
    );
  });
  
  const content = (
    <ErrorBoundary>
      <Switch>{routeElements}</Switch>
      <OfflineIndicator />
    </ErrorBoundary>
  );
  
  // Wrap with layout for most pages, except landing page for non-authenticated users
  return shouldShowLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  return (
    <>
      <NavigationToast />
      <AppRouter />
      <Toaster />
    </>
  );
}

export default App;
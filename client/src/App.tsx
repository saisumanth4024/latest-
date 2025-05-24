import React, { Suspense, lazy, useState, useEffect } from "react";
import { Switch, Route, useLocation, useRoute, Redirect } from "wouter";
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
const SignupPage = lazy(() => import("@/pages/SignupPage"));
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
    requireAuth: true,
    title: "Dashboard",
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
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
    path: "/signup",
    component: SignupPage,
    requireAuth: false,
    title: "Sign Up",
    hideInMenu: true,
    roles: ['guest'] as UserRole[],
  },
  {
    path: "/forms-advanced",
    component: AdvancedFormPage,
    requireAuth: true,
    title: "Advanced Forms",
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
  },
  {
    path: "/ts-patterns-demo",
    component: TypeScriptPatternsDemo,
    requireAuth: true,
    title: "TypeScript Patterns Demo",
    roles: ['user', 'admin', 'seller', 'moderator'] as UserRole[],
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

// Protected Route component using traditional authentication
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
  
  // Store the current path for redirection after login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save current path for redirection after login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      // Redirect to login
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // If still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, don't render anything (redirection happens in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If roles are specified, check if user has required role
  if (roles && roles.length > 0 && user) {
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

// Redirect to login if not on login page
function RedirectToLogin() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    navigate("/login");
  }, [navigate]);
  
  return <GlobalLoadingFallback />;
}

// Main Router Component
function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [isRootMatch] = useRoute("/");
  const [isLoginMatch] = useRoute("/login");
  const [isSignupMatch] = useRoute("/signup");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Redirect to login if not authenticated and not already on login/signup page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginMatch && !isSignupMatch) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, isLoginMatch, isSignupMatch, navigate, location]);

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

  // Always wrap content with ErrorBoundary
  const content = (
    <ErrorBoundary>
      <Switch>
        {/* Special handling for the root path - redirect to login if not authenticated */}
        <Route path="/">
          {isAuthenticated ? (
            <Suspense fallback={<GlobalLoadingFallback />}>
              <Dashboard />
            </Suspense>
          ) : (
            <RedirectToLogin />
          )}
        </Route>

        {/* Login and Signup routes should not require auth */}
        <Route path="/login">
          {isAuthenticated ? (
            <Redirect to="/" />
          ) : (
            <Suspense fallback={<GlobalLoadingFallback />}>
              <LoginPage />
            </Suspense>
          )}
        </Route>

        <Route path="/signup">
          {isAuthenticated ? (
            <Redirect to="/" />
          ) : (
            <Suspense fallback={<GlobalLoadingFallback />}>
              <SignupPage />
            </Suspense>
          )}
        </Route>

        {/* All other routes */}
        {routes
          .filter(route => route.path !== "/" && route.path !== "/login" && route.path !== "/signup")
          .map((route, index) => {
            const Component = route.component;
            const WrappedComponent = () => (
              <ErrorBoundary boundary={route.title}>
                <Suspense fallback={<GlobalLoadingFallback />}>
                  <Component />
                </Suspense>
              </ErrorBoundary>
            );

            return route.requireAuth ? (
              <Route key={index} path={route.path}>
                <ProtectedRoute roles={route.roles}>
                  <WrappedComponent />
                </ProtectedRoute>
              </Route>
            ) : (
              <Route 
                key={index} 
                path={route.path} 
                component={WrappedComponent} 
              />
            );
          })}
      </Switch>
      <OfflineIndicator />
    </ErrorBoundary>
  );
  
  // Only show Layout if user is authenticated and not on login/signup pages
  const showLayout = isAuthenticated && !isLoginMatch && !isSignupMatch;
  
  return showLayout ? <Layout>{content}</Layout> : content;
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
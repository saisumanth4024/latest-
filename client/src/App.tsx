import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ProfilePageLegacy from "@/pages/ProfilePage";
import ProfilePage from "@/features/profile/ProfilePage";
import { AuthProvider, ProtectedRoute, useAuthRedirect } from "@/features/auth";
import { UserRole } from "@/types";

// Define placeholder components for routes that don't have implementations yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title} Page</h1>
    <p className="text-gray-600 dark:text-gray-400">This page is under construction.</p>
  </div>
);

// Import the actual ProductsPage component
import { ProductsPage as ProductsPageImpl } from "@/features/products";

// Import cart and wishlist pages
import CartPage from "@/features/cart/components/CartPage";
import WishlistPage from "@/features/wishlist/components/WishlistPage";

// Import checkout page
import Checkout from "@/features/checkout/components/Checkout";

// Create components for each route
const ProductsPlaceholder = () => <PlaceholderPage title="Products" />;
import OrdersPage from '@/features/orders/components/OrdersPage';
const SearchPage = () => <PlaceholderPage title="Search" />;
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
  },
  { 
    path: "/products", 
    component: ProductsPageImpl, 
    requireAuth: false,
    title: "Products"
  },
  {
    path: "/cart",
    component: CartPage,
    requireAuth: false,
    title: "Cart"
  },
  {
    path: "/checkout",
    component: Checkout,
    requireAuth: false,
    title: "Checkout",
    hideInMenu: true,
  },
  {
    path: "/wishlists",
    component: WishlistPage,
    requireAuth: true,
    title: "Wishlists"
  },
  { 
    path: "/orders", 
    component: OrdersPage, 
    requireAuth: true,
    title: "Orders"
  },
  { 
    path: "/search", 
    component: SearchPage, 
    requireAuth: false,
    title: "Search"
  },
  { 
    path: "/analytics", 
    component: AnalyticsPage, 
    requireAuth: true,
    title: "Analytics",
  },
  { 
    path: "/profile", 
    component: ProfilePage, 
    requireAuth: true,
    title: "Profile",
  },
  { 
    path: "/profile-legacy", 
    component: ProfilePageLegacy, 
    requireAuth: true,
    title: "Profile (Legacy)",
    hideInMenu: true,
  },
  { 
    path: "/settings", 
    component: ProfilePage, 
    requireAuth: true,
    title: "Settings",
  },
  { 
    path: "/admin/dashboard", 
    component: AdminDashboardPage, 
    requireAuth: true,
    roles: [UserRole.ADMIN],
    title: "Admin Dashboard",
  },
  { 
    path: "/seller/dashboard", 
    component: SellerDashboardPage, 
    requireAuth: true,
    roles: [UserRole.SELLER, UserRole.ADMIN],
    title: "Seller Dashboard",
  },
  { 
    path: "/login", 
    component: LoginPage, 
    requireAuth: false,
    title: "Login",
    hideInMenu: true,
  },
  { 
    path: "/signup", 
    component: SignupPage, 
    requireAuth: false,
    title: "Sign Up",
    hideInMenu: true,
  },
  { 
    path: "*", 
    component: NotFound,
    requireAuth: false,
    title: "Not Found",
    hideInMenu: true,
  }
];

// Router Component that handles auth redirection
function AppRouter() {
  // Listen for auth redirects
  useAuthRedirect();
  
  // Get current path to determine if we should show the layout
  const [location] = useLocation();
  const noLayoutPaths = ['/login', '/signup'];
  const shouldShowLayout = !noLayoutPaths.includes(location);
  
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
          <route.component />
        </ProtectedRoute>
      </Route>
    );
  });
  
  const content = <Switch>{routeElements}</Switch>;
  
  // Wrap with layout for most pages, except login/signup
  return shouldShowLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { navigateTo, selectCurrentPath } from './navigationSlice';

/**
 * Component that shows toast notifications when navigating between pages
 * This is a "ghost" component that doesn't render anything visible
 */
const NavigationToast = () => {
  const [location] = useLocation();
  const dispatch = useDispatch();
  const currentPath = useSelector(selectCurrentPath);
  const { toast } = useToast();
  
  // Helper function to get the route name from the path
  const getRouteName = (path: string): string => {
    // Default name if route not found
    let routeName = 'Unknown Page';
    
    // Define routes map
    const pathToTitle: Record<string, string> = {
      "/": "Dashboard",
      "/dashboard": "Dashboard",
      "/login": "Login",
      "/signup": "Sign Up",
      "/products": "Products",
      "/extended-products": "Extended Catalog",
      "/cart": "Cart",
      "/checkout": "Checkout",
      "/orders": "Orders",
      "/profile": "Profile",
      "/wishlists": "Wishlists",
      "/settings": "Settings",
      "/analytics": "Analytics",
      "/admin/dashboard": "Admin Dashboard",
      "/search": "Search Results"
    };
    
    // First check for exact match
    if (pathToTitle[path]) {
      return pathToTitle[path];
    }
    
    // Handle dynamic routes
    if (path.startsWith('/products/') && path.split('/').length === 3) {
      return "Product Details";
    }
    
    // Return the default if no matches
    return routeName;
  };
  
  useEffect(() => {
    // Only dispatch and show toast if this is a new navigation
    if (location !== currentPath) {
      // Update the navigation state
      dispatch(navigateTo(location));
    
      // Show toast notification
      const routeName = getRouteName(location);
      
      toast({
        title: `Navigated to ${routeName}`,
        description: "You are now viewing the " + routeName + " page",
        duration: 3000, // 3 seconds
        variant: "default",
      });
    }
    
  }, [location, dispatch, currentPath, toast]);
  
  // This component doesn't render anything visible
  return null;
};

export default NavigationToast;
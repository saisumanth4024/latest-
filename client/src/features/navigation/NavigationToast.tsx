import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useDispatch } from 'react-redux';
import { navigateTo } from './navigationSlice';
import { toast } from '@/hooks/use-toast';
import { MoveRight } from 'lucide-react';

// Map of routes to friendly names
const routeNames: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/profile': 'Profile',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/search': 'Search Results',
  '/cart': 'Shopping Cart',
  '/checkout': 'Checkout',
  '/orders': 'Orders',
  '/settings': 'Settings',
  '/help': 'Help & Support',
  '/about': 'About Us',
  '/contact': 'Contact Us',
};

// Get a friendly name for a route, falling back to a formatted path
const getRouteName = (path: string): string => {
  // Check if we have a predefined name
  if (routeNames[path]) return routeNames[path];
  
  // Check for dynamic routes like /products/123
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 1) {
    const baseRoute = `/${segments[0]}`;
    if (routeNames[baseRoute]) {
      // For detail pages like /products/123
      return `${routeNames[baseRoute]} Detail`;
    }
  }
  
  // Format the path as a fallback
  return segments.length > 0 
    ? segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') 
    : 'Unknown Page';
};

export const NavigationToast: React.FC = () => {
  const [location] = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Update Redux state with the new route
    dispatch(navigateTo(location));
    
    // Show toast notification
    const routeName = getRouteName(location);
    
    toast({
      title: (
        <div className="flex items-center gap-2">
          <MoveRight className="h-4 w-4" />
          <span>Navigated to {routeName}</span>
        </div>
      ),
      description: "You are now viewing the " + routeName + " page",
      duration: 3000, // 3 seconds
      variant: "default",
    });
    
  }, [location, dispatch]);
  
  // This component doesn't render anything visible
  return null;
};

export default NavigationToast;
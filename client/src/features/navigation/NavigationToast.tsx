import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { navigateTo, selectCurrentPath } from './navigationSlice';
import { routes } from '@/App';

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
    
    // Look up the name in the routes array
    const route = routes.find(r => {
      // Exact match
      if (r.path === path) return true;
      
      // Dynamic route with parameters (e.g., /products/:id)
      if (r.path?.includes(':')) {
        const routeParts = r.path.split('/');
        const pathParts = path.split('/');
        
        // Must have same number of parts
        if (routeParts.length !== pathParts.length) return false;
        
        // Check each part, allowing parameters to match anything
        return routeParts.every((part, i) => {
          return part.startsWith(':') || part === pathParts[i];
        });
      }
      
      return false;
    });
    
    if (route) {
      routeName = route.title || 'Page';
    }
    
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
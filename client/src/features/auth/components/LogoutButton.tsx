import { useState } from 'react';
import { useLocation } from '@/router/wouterCompat';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout, selectAuthStatus } from '../authSlice';
import { useToast } from '@/hooks/use-toast';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function LogoutButton({ 
  variant = 'default', 
  size = 'default',
  className = ''
}: LogoutButtonProps) {
  const dispatch = useAppDispatch();
  const [, setLocation] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const auth = useAppSelector(state => state.auth);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Show initial toast
      toast({
        title: "Logging out...",
        description: "You are being logged out of your account.",
      });
      
      // Using only traditional authentication
      
      // For traditional auth, make a fetch request to the server logout endpoint to clear session
      const response = await fetch('/api/auth/logout');
      
      // Then dispatch Redux action to clear client state
      dispatch(logout());
      
      // Ensure all localStorage items are cleared directly as well
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');
      localStorage.removeItem('auth_method');
      localStorage.removeItem('demoUserRole');
      sessionStorage.clear(); // Clear any session storage items as well
      
      // Check if the server request was successful
      if (response.ok) {
        // Show success toast
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
          variant: "success"
        });
        
        // Force a page refresh to reset all app state
        setTimeout(() => {
          window.location.href = '/login';
        }, 300);
      } else {
        throw new Error("Server logout request failed");
      }
    } catch (error) {
      // Even if server request fails, still clear local state
      dispatch(logout());
      
      // Clear all storage again to be safe
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');
      localStorage.removeItem('auth_method');
      localStorage.removeItem('demoUserRole');
      sessionStorage.clear();
      
      toast({
        title: "Logout warning",
        description: "There was an issue with the server logout. Your local session has been cleared.",
        variant: "warning"
      });
      
      // Force a page refresh to reset all app state
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
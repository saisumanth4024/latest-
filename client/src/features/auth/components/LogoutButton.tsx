import { useState } from 'react';
import { useLocation } from 'wouter';
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
  const authStatus = useAppSelector(selectAuthStatus);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // This will handle the logout through the Redux action
      // For Replit auth, it will redirect to the correct API endpoint
      dispatch(logout());
      
      // Only show toast and redirect if using traditional auth
      // For Replit auth, the redirect happens in the authSlice
      if (localStorage.getItem('auth_method') !== 'replit') {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        // Redirect to login page
        setLocation('/login');
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive"
      });
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
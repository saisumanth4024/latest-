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
      // Show initial toast
      toast({
        title: "Logging out...",
        description: "You are being logged out of your account.",
      });
      
      // First make a fetch request to the server logout endpoint to clear session
      const response = await fetch('/api/auth/logout');
      
      // Then dispatch Redux action to clear client state
      dispatch(logout());
      
      // Check if the server request was successful
      if (response.ok) {
        // Show success toast
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
          variant: "success"
        });
        
        // Redirect to login page with wouter
        setLocation('/login');
      } else {
        throw new Error("Server logout request failed");
      }
    } catch (error) {
      // Even if server request fails, still clear local state
      dispatch(logout());
      
      toast({
        title: "Logout warning",
        description: "There was an issue with the server logout. Your local session has been cleared.",
        variant: "warning"
      });
      
      // Still redirect to login
      setLocation('/login');
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
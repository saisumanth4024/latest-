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
      // Show success toast
      toast({
        title: "Logging out...",
        description: "You are being logged out of your account.",
      });
      
      // First clear Redux state
      dispatch(logout());
      
      // Make a fetch request to the server logout endpoint
      const response = await fetch('/api/auth/logout');
      
      // Check if the response was successful
      if (response.ok) {
        // Redirect to login page with wouter
        setLocation('/login');
        
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
          variant: "success"
        });
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive"
      });
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
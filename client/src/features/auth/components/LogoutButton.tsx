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
      
      // Direct browser navigation to the logout endpoint
      // This will handle the server-side session clearing and redirection
      window.location.href = '/api/auth/logout';
      
      // Also clear Redux state (this will likely not complete before redirect)
      dispatch(logout());
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
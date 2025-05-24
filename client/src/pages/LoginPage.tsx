import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [, setLocation] = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <LoginForm />
      </div>
    </div>
  );
}
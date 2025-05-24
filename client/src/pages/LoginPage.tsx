import { useEffect } from 'react';
import { useLocation } from 'wouter';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Return to home page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
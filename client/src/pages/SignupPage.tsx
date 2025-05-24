import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { SignupForm, useAuth } from '@/features/auth';

export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      // Check URL params for redirect
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      
      if (returnTo) {
        setLocation(decodeURIComponent(returnTo));
      } else {
        // Default to home page
        setLocation('/');
      }
    }
  }, [isAuthenticated, setLocation]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Fill in the details below to get started
            </p>
          </div>
          
          <SignupForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="font-medium text-primary hover:text-primary/90 transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect } from 'react';
import { useLocation } from '@/router/wouterCompat';
import { useAuth } from '@/features/auth';
import SignupWizard from '@/features/auth/components/signup/SignupWizard';
import { useAppDispatch } from '@/app/hooks';
import { resetWizard } from '@/features/auth/components/signup/signupWizardSlice';

export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  
  // Reset wizard state when component mounts
  useEffect(() => {
    dispatch(resetWizard());
  }, [dispatch]);
  
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
        <SignupWizard />
      </div>
    </div>
  );
}
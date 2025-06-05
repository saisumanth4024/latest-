import React, { useState } from 'react';
import { useLocation } from '@/router/wouterCompat';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectSignupFormData, 
  selectSignupError,
  setActiveStep,
  startSubmitting,
  finishSubmitting,
  setError,
  resetWizard
} from './signupWizardSlice';
import { signup } from '../../authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, Edit2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const ReviewStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSignupFormData);
  const error = useAppSelector(selectSignupError);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const goToStep = (step: 'account' | 'profile' | 'preferences') => {
    dispatch(setActiveStep(step));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    dispatch(startSubmitting());
    
    try {
      // Only take the essential account information for signup
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      
      // Submit to auth API through the signup action
      const resultAction = await dispatch(signup(userData));
      
      if (signup.fulfilled.match(resultAction)) {
        // Store email in sessionStorage to pre-fill login form
        sessionStorage.setItem('signupEmail', userData.email);
        
        // Store other profile and preferences data in localStorage for retrieval later
        // after the user logs in (in a real app, you might save this server-side)
        localStorage.setItem('pendingUserProfile', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          bio: formData.bio,
          theme: formData.theme,
          emailNotifications: formData.emailNotifications,
          marketingEmails: formData.marketingEmails,
          privacySettings: formData.privacySettings,
        }));
        
        dispatch(finishSubmitting());
        
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please sign in to continue.",
          variant: "success"
        });
        
        // Reset wizard state
        dispatch(resetWizard());
        
        // Add a small delay to ensure toast is visible before redirecting
        setTimeout(() => {
          // Redirect to login page
          setLocation('/login');
        }, 1000);
      } else if (signup.rejected.match(resultAction)) {
        dispatch(setError(resultAction.payload as string || "An error occurred during registration."));
        toast({
          title: "Registration failed",
          description: resultAction.payload as string || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      dispatch(setError(error.message || "An unexpected error occurred."));
      toast({
        title: "Registration error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review Your Information</h2>
        <p className="text-muted-foreground">
          Please verify that all details are correct before creating your account
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => goToStep('account')}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{formData.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Password</p>
                <p className="font-medium">••••••••••</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => goToStep('profile')}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{formData.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{formData.lastName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium">{formData.displayName}</p>
              </div>
              {formData.bio && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium">{formData.bio}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preferences</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => goToStep('preferences')}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Theme</p>
                <p className="font-medium capitalize">{formData.theme}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Profile Visibility</p>
                <p className="font-medium capitalize">{formData.privacySettings.profileVisibility}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Notification Settings</h4>
                <div className="flex items-center">
                  {formData.emailNotifications ? (
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <span className="h-4 w-4 mr-2 block" />
                  )}
                  <span>Email Notifications</span>
                </div>
                
                <div className="flex items-center">
                  {formData.marketingEmails ? (
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <span className="h-4 w-4 mr-2 block" />
                  )}
                  <span>Marketing Emails</span>
                </div>
                
                <div className="flex items-center">
                  {formData.privacySettings.showActivity ? (
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <span className="h-4 w-4 mr-2 block" />
                  )}
                  <span>Show Activity to Others</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep('preferences')}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={submitting}
          className="min-w-32"
        >
          {submitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
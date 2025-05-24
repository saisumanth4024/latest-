import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { 
  selectActiveStep,
  selectCompletedSteps,
  type SignupStep
} from './signupWizardSlice';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AccountStep from './AccountStep';
import ProfileStep from './ProfileStep';
import PreferencesStep from './PreferencesStep';
import ReviewStep from './ReviewStep';
import { CheckCircle } from 'lucide-react';

/**
 * Multi-step signup wizard component that guides users through the registration process
 * using a step-by-step approach with Redux-backed state management.
 */
const SignupWizard: React.FC = () => {
  const activeStep = useAppSelector(selectActiveStep);
  const completedSteps = useAppSelector(selectCompletedSteps);
  
  // Calculate progress percentage
  const totalSteps = 4; // account, profile, preferences, review
  const completedCount = completedSteps.length;
  const progressPercentage = Math.min(
    Math.round((completedCount / (totalSteps - 1)) * 100),
    100
  );
  
  // Convert activeStep to string for Tabs value
  const activeTabValue = activeStep;
  
  // Helper to determine if a step is completed
  const isStepCompleted = (step: SignupStep) => completedSteps.includes(step);
  
  // Tabs are disabled if the step is not completed and not the active step
  const isTabDisabled = (step: SignupStep) => {
    // The active step is always enabled
    if (step === activeStep) return false;
    
    // If previous steps are not completed, disable this step
    if (step === 'profile' && !isStepCompleted('account')) return true;
    if (step === 'preferences' && !isStepCompleted('profile')) return true;
    if (step === 'review' && !isStepCompleted('preferences')) return true;
    
    // Otherwise, enable the tab
    return false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <div className="text-sm text-muted-foreground">
            {completedCount} of {totalSteps - 1} steps completed
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <Card>
        <Tabs value={activeTabValue} className="w-full">
          <TabsList className="grid grid-cols-4 mb-0 w-full">
            <TabsTrigger 
              value="account" 
              disabled={isTabDisabled('account')}
              className="relative"
            >
              {isStepCompleted('account') && (
                <CheckCircle className="h-4 w-4 absolute -top-2 -right-2 text-green-500" />
              )}
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              disabled={isTabDisabled('profile')}
              className="relative"
            >
              {isStepCompleted('profile') && (
                <CheckCircle className="h-4 w-4 absolute -top-2 -right-2 text-green-500" />
              )}
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              disabled={isTabDisabled('preferences')}
              className="relative"
            >
              {isStepCompleted('preferences') && (
                <CheckCircle className="h-4 w-4 absolute -top-2 -right-2 text-green-500" />
              )}
              Preferences
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              disabled={isTabDisabled('review')}
              className="relative"
            >
              {isStepCompleted('review') && (
                <CheckCircle className="h-4 w-4 absolute -top-2 -right-2 text-green-500" />
              )}
              Review
            </TabsTrigger>
          </TabsList>
          
          <CardContent className="p-6">
            <TabsContent value="account" className="mt-0">
              <AccountStep />
            </TabsContent>
            <TabsContent value="profile" className="mt-0">
              <ProfileStep />
            </TabsContent>
            <TabsContent value="preferences" className="mt-0">
              <PreferencesStep />
            </TabsContent>
            <TabsContent value="review" className="mt-0">
              <ReviewStep />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
};

export default SignupWizard;
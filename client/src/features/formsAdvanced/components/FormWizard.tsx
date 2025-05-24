import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectCurrentStep, 
  selectCompletedSteps,
  setCurrentStep,
  resetForm
} from '../store/formsAdvancedSlice';
import PersonalInfoForm from './steps/PersonalInfoForm';
import AddressesForm from './steps/AddressesForm';
import ContactMethodsForm from './steps/ContactMethodsForm';
import AccountForm from './steps/AccountForm';
import ReviewForm from './steps/ReviewForm';
import WizardProgress from './WizardProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FORM_STEPS = [
  { id: 1, title: 'Personal Information', component: PersonalInfoForm },
  { id: 2, title: 'Addresses', component: AddressesForm },
  { id: 3, title: 'Contact Methods', component: ContactMethodsForm },
  { id: 4, title: 'Account Setup', component: AccountForm },
  { id: 5, title: 'Review & Submit', component: ReviewForm },
];

const FormWizard: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const completedSteps = useAppSelector(selectCompletedSteps);
  const { toast } = useToast();

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      // Uncomment if you want to reset the form when navigating away
      // dispatch(resetForm());
    };
  }, [dispatch]);

  const currentStepData = FORM_STEPS.find(step => step.id === currentStep) || FORM_STEPS[0];
  const CurrentStepComponent = currentStepData.component;

  const goToStep = (step: number) => {
    // Only allow navigation to completed steps or the next uncompleted step
    if (completedSteps.includes(step) || step === currentStep || step === Math.min(...completedSteps.map(s => s + 1))) {
      dispatch(setCurrentStep(step));
    } else {
      toast({
        title: "Cannot Skip Steps",
        description: "Please complete the current step before proceeding.",
        variant: "destructive"
      });
    }
  };

  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= FORM_STEPS.length) {
      dispatch(setCurrentStep(nextStep));
    }
  };

  const goToPreviousStep = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 1) {
      dispatch(setCurrentStep(prevStep));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Sign Up Form</h1>
      
      <WizardProgress 
        steps={FORM_STEPS} 
        currentStep={currentStep} 
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">
            Step {currentStep}: {currentStepData.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <CurrentStepComponent 
            onComplete={goToNextStep}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < FORM_STEPS.length ? (
            <Button
              onClick={goToNextStep}
              disabled={!completedSteps.includes(currentStep)}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Form submission logic will be handled in the ReviewForm component
              }}
              className="flex items-center gap-2"
              variant="default"
            >
              Submit
              <Save className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormWizard;
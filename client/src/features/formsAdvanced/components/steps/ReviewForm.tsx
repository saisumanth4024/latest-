import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  selectPersonalInfo,
  selectAddresses,
  selectContactMethods,
  selectAccountInfo,
  markStepCompleted,
  setSubmitting,
  setSubmitted,
  setSubmitError
} from '../../store/formsAdvancedSlice';

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Check, 
  AlertCircle, 
  Mail, 
  Phone, 
  AtSign,
  Home,
  Calendar,
  User,
  Shield,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ReviewFormProps {
  onComplete: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const personalInfo = useAppSelector(selectPersonalInfo);
  const addresses = useAppSelector(selectAddresses);
  const contactMethods = useAppSelector(selectContactMethods);
  const accountInfo = useAppSelector(selectAccountInfo);
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    // Set submitting state in Redux
    dispatch(setSubmitting(true));
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit the form
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Dispatch successful submission
      dispatch(setSubmitted(true));
      dispatch(setSubmitting(false));
      dispatch(markStepCompleted(5));
      
      // Show success toast
      toast({
        title: "Registration Complete!",
        description: "Your account has been successfully created.",
        variant: "default",
      });
      
      onComplete();
    } catch (error) {
      // Dispatch error in submission
      dispatch(setSubmitError(error instanceof Error ? error.message : 'Unknown error occurred'));
      dispatch(setSubmitting(false));
      
      // Show error toast
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get primary contact method
  const primaryContactMethod = contactMethods.find(method => method.isPrimary);
  
  // Get default address
  const defaultAddress = addresses.find(address => address.isDefault) || addresses[0];
  
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Review Your Information</AlertTitle>
        <AlertDescription>
          Please review all the information you've provided before submitting. You can go back to any previous step to make changes.
        </AlertDescription>
      </Alert>
      
      {/* Personal Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Full Name</div>
              <div>{personalInfo.firstName} {personalInfo.lastName}</div>
            </div>
            <div>
              <div className="font-medium">Email</div>
              <div>{personalInfo.email}</div>
            </div>
            <div>
              <div className="font-medium">Phone Number</div>
              <div>{personalInfo.phoneNumber}</div>
            </div>
            <div>
              <div className="font-medium">Date of Birth</div>
              <div>
                {personalInfo.dateOfBirth ? (
                  format(new Date(personalInfo.dateOfBirth), "MMMM d, yyyy")
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Default Address Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Home className="h-5 w-5 mr-2 text-primary" />
            Default Address
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Street</div>
              <div>{defaultAddress.street}</div>
            </div>
            <div>
              <div className="font-medium">City</div>
              <div>{defaultAddress.city}</div>
            </div>
            <div>
              <div className="font-medium">State/Province</div>
              <div>{defaultAddress.state}</div>
            </div>
            <div>
              <div className="font-medium">Zip/Postal Code</div>
              <div>{defaultAddress.zipCode}</div>
            </div>
            <div>
              <div className="font-medium">Country</div>
              <div>{defaultAddress.country}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          {addresses.length > 1 && `+ ${addresses.length - 1} additional addresses`}
        </CardFooter>
      </Card>
      
      {/* Primary Contact Method Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Star className="h-5 w-5 mr-2 text-primary fill-primary" />
            Primary Contact Method
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          {primaryContactMethod && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium">Type</div>
                <div className="flex items-center">
                  {primaryContactMethod.type === 'email' && <Mail className="h-4 w-4 mr-1" />}
                  {primaryContactMethod.type === 'phone' && <Phone className="h-4 w-4 mr-1" />}
                  {primaryContactMethod.type === 'social' && <AtSign className="h-4 w-4 mr-1" />}
                  {primaryContactMethod.type.charAt(0).toUpperCase() + primaryContactMethod.type.slice(1)}
                </div>
              </div>
              <div>
                <div className="font-medium">Value</div>
                <div>{primaryContactMethod.value}</div>
              </div>
              {primaryContactMethod.label && (
                <div>
                  <div className="font-medium">Label</div>
                  <div>{primaryContactMethod.label}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 text-xs text-muted-foreground">
          {contactMethods.length > 1 && `+ ${contactMethods.length - 1} additional contact methods`}
        </CardFooter>
      </Card>
      
      {/* Account Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-medium">Username</div>
              <div>{accountInfo.username}</div>
            </div>
            <div>
              <div className="font-medium">Password</div>
              <div>••••••••••••</div>
            </div>
            <div>
              <div className="font-medium">Newsletter</div>
              <div>{accountInfo.receiveNewsletters ? 'Subscribed' : 'Not subscribed'}</div>
            </div>
            <div>
              <div className="font-medium">Terms & Conditions</div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1 text-green-500" />
                Accepted
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Registration'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Timer, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import {
  verifyOTP,
  requestOTP,
  setActiveStep,
  updateOTPVerification,
  selectOTPVerification,
  selectCheckoutError,
  clearError,
} from '../checkoutSlice';
import { CheckoutStep } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';

export default function OTPVerification() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const otpVerification = useSelector(selectOTPVerification);
  const error = useSelector(selectCheckoutError);
  
  const [otp, setOTP] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Countdown timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Input refs for OTP fields
  const otpInputRef = useRef<HTMLInputElement>(null);
  
  // Focus on first input field when component mounts
  useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);
  
  // Setup countdown timer
  useEffect(() => {
    if (otpVerification?.expiresAt) {
      const expiresAt = new Date(otpVerification.expiresAt).getTime();
      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = expiresAt - now;
        
        if (diff <= 0) {
          setTimeLeft(0);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        } else {
          setTimeLeft(Math.floor(diff / 1000));
        }
      };
      
      // Initial update
      updateTimer();
      
      // Setup interval
      timerRef.current = setInterval(updateTimer, 1000);
      
      // Cleanup
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [otpVerification?.expiresAt]);
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otpVerification?.requestId || !otp) return;
    
    setIsSubmitting(true);
    
    try {
      await dispatch(verifyOTP({
        requestId: otpVerification.requestId,
        otp,
      }));
      
      // If no error, verification was successful
      toast({
        title: 'OTP Verified',
        description: 'Your payment has been authorized.',
        variant: 'success',
      });
    } catch (err) {
      // Error is handled by the thunk and stored in state
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!otpVerification?.phoneNumber) return;
    
    try {
      await dispatch(requestOTP({
        phoneNumber: otpVerification.phoneNumber,
        email: otpVerification.email,
      }));
      
      toast({
        title: 'OTP Resent',
        description: 'A new verification code has been sent to your phone.',
      });
      
      // Clear any previous errors
      dispatch(clearError());
      
      // Clear OTP input
      setOTP('');
      
      // Focus on first input
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
    } catch (err) {
      // Error is handled by the thunk and stored in state
    }
  };
  
  // Handle OTP input change
  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOTP(value);
    }
  };
  
  // Handle going back to payment
  const handleBackToPayment = () => {
    dispatch(setActiveStep(CheckoutStep.PAYMENT));
  };
  
  // If no OTP verification object, redirect to payment
  if (!otpVerification) {
    toast({
      title: 'OTP Verification Error',
      description: 'No active OTP verification session. Returning to payment.',
      variant: 'destructive',
    });
    
    dispatch(setActiveStep(CheckoutStep.PAYMENT));
    return null;
  }
  
  // If exceeding max attempts
  const isMaxAttemptsExceeded = otpVerification.attempts >= otpVerification.maxAttempts;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify Your Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="mb-2">
            We've sent a one-time verification code to:
          </p>
          <p className="font-medium text-lg">
            {otpVerification.phoneNumber}
          </p>
          {otpVerification.email && (
            <p className="text-sm text-muted-foreground mt-1">
              A backup code was also sent to {otpVerification.email}
            </p>
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {isMaxAttemptsExceeded ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Too Many Attempts</AlertTitle>
            <AlertDescription>
              You've exceeded the maximum number of verification attempts.
              Please try again later or contact customer support.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <div className="text-center mb-2">
                  <label htmlFor="otp-input" className="text-sm font-medium">
                    Enter 6-digit verification code
                  </label>
                </div>
                <Input
                  id="otp-input"
                  ref={otpInputRef}
                  type="text"
                  value={otp}
                  onChange={handleOTPChange}
                  placeholder="123456"
                  className="text-center text-xl tracking-widest py-6"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  disabled={isSubmitting || otpVerification.isVerified}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {timeLeft > 0 ? (
                    <>Code expires in {formatTime(timeLeft)}</>
                  ) : (
                    <>Code expired</>
                  )}
                </span>
              </div>
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={timeLeft > 0 || isSubmitting}
              >
                Resend Code
              </Button>
            </div>
            
            {otpVerification.isVerified && (
              <Alert variant="success" className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertTitle className="text-green-600 dark:text-green-500">Verification Successful</AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-500">
                  Your payment has been verified successfully.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBackToPayment} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment
        </Button>
        
        <Button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isSubmitting || isMaxAttemptsExceeded || timeLeft === 0 || otpVerification.isVerified}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : otpVerification.isVerified ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verified
            </>
          ) : (
            <>Verify and Continue</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Phone,
  Wallet,
  Truck,
  Building,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import {
  setSelectedPaymentMethod,
  setPaymentDetails,
  setActiveStep,
  requestOTP,
  selectSelectedPaymentMethod,
  selectPaymentDetails,
  selectSavedPaymentMethods,
  selectOrderTotal,
} from '../checkoutSlice';
import { PaymentMethod, CheckoutStep, CardDetails, UPIDetails, WalletDetails, BankTransferDetails } from '@/types/checkout';
import { formatCurrency } from '@/lib/utils';

// Credit Card validation schema
const cardSchema = z.object({
  cardNumber: z.string()
    .min(16, { message: 'Card number must be at least 16 digits' })
    .max(19, { message: 'Card number must not exceed 19 digits' })
    .refine((val) => /^[0-9\s-]+$/.test(val), { message: 'Card number can only contain digits, spaces, and hyphens' }),
  nameOnCard: z.string().min(2, { message: 'Name on card is required' }),
  expiryMonth: z.string().min(1, { message: 'Expiry month is required' }),
  expiryYear: z.string().min(1, { message: 'Expiry year is required' }),
  cvv: z.string()
    .min(3, { message: 'CVV must be at least 3 digits' })
    .max(4, { message: 'CVV must not exceed 4 digits' })
    .refine((val) => /^\d+$/.test(val), { message: 'CVV can only contain digits' }),
  saveForLater: z.boolean().optional(),
});

// UPI validation schema
const upiSchema = z.object({
  upiId: z.string()
    .min(5, { message: 'UPI ID is required' })
    .refine((val) => val.includes('@'), { message: 'UPI ID must include @ symbol' }),
  provider: z.string().optional(),
});

// Wallet validation schema
const walletSchema = z.object({
  provider: z.string().min(1, { message: 'Wallet provider is required' }),
  mobileNumber: z.string()
    .min(10, { message: 'Mobile number must be at least 10 digits' })
    .refine((val) => /^\d+$/.test(val), { message: 'Mobile number can only contain digits' }),
});

// Bank transfer validation schema
const bankTransferSchema = z.object({
  accountNumber: z.string()
    .min(8, { message: 'Account number must be at least 8 digits' })
    .refine((val) => /^\d+$/.test(val), { message: 'Account number can only contain digits' }),
  bankName: z.string().min(2, { message: 'Bank name is required' }),
  ifscCode: z.string()
    .min(11, { message: 'IFSC code must be 11 characters' })
    .max(11, { message: 'IFSC code must be 11 characters' }),
});

type CardFormValues = z.infer<typeof cardSchema>;
type UPIFormValues = z.infer<typeof upiSchema>;
type WalletFormValues = z.infer<typeof walletSchema>;
type BankTransferFormValues = z.infer<typeof bankTransferSchema>;

// Generate month options
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return {
    value: month.toString().padStart(2, '0'),
    label: month.toString().padStart(2, '0'),
  };
});

// Generate year options (current year + 10 years)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => {
  const year = currentYear + i;
  return {
    value: year.toString(),
    label: year.toString(),
  };
});

// Wallet providers
const WALLET_PROVIDERS = [
  { value: 'paytm', label: 'Paytm' },
  { value: 'phonepe', label: 'PhonePe' },
  { value: 'googlepay', label: 'Google Pay' },
  { value: 'amazonpay', label: 'Amazon Pay' },
];

// Bank list
const BANKS = [
  { value: 'sbi', label: 'State Bank of India' },
  { value: 'hdfc', label: 'HDFC Bank' },
  { value: 'icici', label: 'ICICI Bank' },
  { value: 'axis', label: 'Axis Bank' },
  { value: 'kotak', label: 'Kotak Mahindra Bank' },
];

export default function PaymentForm() {
  const dispatch = useDispatch();
  const selectedPaymentMethod = useSelector(selectSelectedPaymentMethod);
  const savedPaymentMethods = useSelector(selectSavedPaymentMethods);
  const orderTotal = useSelector(selectOrderTotal);
  const [paymentTab, setPaymentTab] = useState<string>(selectedPaymentMethod || PaymentMethod.CREDIT_CARD);
  const [savedMethodId, setSavedMethodId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Credit card form
  const cardForm = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: '',
      nameOnCard: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      saveForLater: false,
    },
  });
  
  // UPI form
  const upiForm = useForm<UPIFormValues>({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      upiId: '',
      provider: '',
    },
  });
  
  // Wallet form
  const walletForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      provider: '',
      mobileNumber: '',
    },
  });
  
  // Bank transfer form
  const bankTransferForm = useForm<BankTransferFormValues>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
    },
  });
  
  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    setPaymentTab(value);
    dispatch(setSelectedPaymentMethod(value as PaymentMethod));
    // Reset saved method selection when changing payment method
    setSavedMethodId(null);
  };
  
  // Handle saved method selection
  const handleSavedMethodSelection = (methodId: string) => {
    setSavedMethodId(methodId);
    const method = savedPaymentMethods.find(m => m.id === methodId);
    if (method) {
      // Set payment method but don't set details (will use saved method)
      dispatch(setSelectedPaymentMethod(method.type));
    }
  };
  
  // Handle back to delivery
  const handleBack = () => {
    dispatch(setActiveStep(CheckoutStep.DELIVERY));
  };
  
  // Handle card payment submission
  const onCardSubmit = (values: CardFormValues) => {
    setIsProcessing(true);
    
    // Format card details
    const cardDetails: CardDetails = {
      ...values,
    };
    
    // Set payment details in Redux
    dispatch(setPaymentDetails({
      method: PaymentMethod.CREDIT_CARD,
      details: cardDetails,
    }));
    
    // For demo purposes, check if mobile OTP verification is required
    // In a real app, this would be determined by the payment processor
    if (Math.random() > 0.5) {
      // Require OTP verification
      dispatch(requestOTP({ phoneNumber: '1234567890' }));
    } else {
      // Continue to summary
      dispatch(setActiveStep(CheckoutStep.SUMMARY));
    }
    
    setIsProcessing(false);
  };
  
  // Handle UPI payment submission
  const onUPISubmit = (values: UPIFormValues) => {
    setIsProcessing(true);
    
    // Format UPI details
    const upiDetails: UPIDetails = {
      ...values,
    };
    
    // Set payment details in Redux
    dispatch(setPaymentDetails({
      method: PaymentMethod.UPI,
      details: upiDetails,
    }));
    
    // Continue to summary
    dispatch(setActiveStep(CheckoutStep.SUMMARY));
    
    setIsProcessing(false);
  };
  
  // Handle wallet payment submission
  const onWalletSubmit = (values: WalletFormValues) => {
    setIsProcessing(true);
    
    // Format wallet details
    const walletDetails: WalletDetails = {
      ...values,
    };
    
    // Set payment details in Redux
    dispatch(setPaymentDetails({
      method: PaymentMethod.WALLET,
      details: walletDetails,
    }));
    
    // Continue to summary
    dispatch(setActiveStep(CheckoutStep.SUMMARY));
    
    setIsProcessing(false);
  };
  
  // Handle bank transfer submission
  const onBankTransferSubmit = (values: BankTransferFormValues) => {
    setIsProcessing(true);
    
    // Format bank transfer details
    const bankTransferDetails: BankTransferDetails = {
      ...values,
    };
    
    // Set payment details in Redux
    dispatch(setPaymentDetails({
      method: PaymentMethod.BANK_TRANSFER,
      details: bankTransferDetails,
    }));
    
    // Continue to summary
    dispatch(setActiveStep(CheckoutStep.SUMMARY));
    
    setIsProcessing(false);
  };
  
  // Handle COD selection
  const handleCODSelection = () => {
    // Set COD as payment method
    dispatch(setPaymentDetails({
      method: PaymentMethod.COD,
    }));
    
    // Continue to summary
    dispatch(setActiveStep(CheckoutStep.SUMMARY));
  };
  
  // Handle using saved method
  const handleUseSavedMethod = () => {
    if (savedMethodId) {
      const method = savedPaymentMethods.find(m => m.id === savedMethodId);
      if (method) {
        // Set payment method (details will be retrieved server-side by ID)
        dispatch(setPaymentDetails({
          method: method.type,
          details: { savedMethodId } as any, // Simplified for demo
        }));
        
        // Continue to summary
        dispatch(setActiveStep(CheckoutStep.SUMMARY));
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Payment Method Tabs */}
        <Tabs value={paymentTab} onValueChange={handlePaymentMethodChange} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-6">
            <TabsTrigger value={PaymentMethod.CREDIT_CARD} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value={PaymentMethod.UPI} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Phone className="h-4 w-4 mr-2" />
              UPI
            </TabsTrigger>
            <TabsTrigger value={PaymentMethod.WALLET} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value={PaymentMethod.BANK_TRANSFER} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building className="h-4 w-4 mr-2" />
              Bank
            </TabsTrigger>
            <TabsTrigger value={PaymentMethod.COD} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Truck className="h-4 w-4 mr-2" />
              COD
            </TabsTrigger>
          </TabsList>
          
          {/* Saved payment methods (if available) */}
          {savedPaymentMethods.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
              <RadioGroup value={savedMethodId || ''} onValueChange={setSavedMethodId} className="space-y-3">
                {savedPaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                      {method.type === PaymentMethod.CREDIT_CARD && (
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>{method.cardBrand} {method.maskedNumber}</span>
                          <span className="text-muted-foreground ml-2">Expires {method.cardExpiry}</span>
                        </div>
                      )}
                      {method.type === PaymentMethod.UPI && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>UPI ID: {method.upiId}</span>
                        </div>
                      )}
                      {method.type === PaymentMethod.WALLET && (
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          <span>{method.walletProvider} Wallet</span>
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {savedMethodId && (
                <div className="mt-4">
                  <Button onClick={handleUseSavedMethod}>
                    Use Selected Method
                  </Button>
                </div>
              )}
              <Separator className="my-6" />
              <h3 className="text-lg font-medium mb-4">Or Use a New Payment Method</h3>
            </div>
          )}
          
          {/* Credit Card Form */}
          <TabsContent value={PaymentMethod.CREDIT_CARD}>
            <Form {...cardForm}>
              <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Card Number */}
                  <FormField
                    control={cardForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Card Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="4242 4242 4242 4242" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Name on Card */}
                  <FormField
                    control={cardForm.control}
                    name="nameOnCard"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Name on Card *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Expiry Month */}
                  <FormField
                    control={cardForm.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Month *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Select month</option>
                            {MONTHS.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Expiry Year */}
                  <FormField
                    control={cardForm.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Year *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Select year</option>
                            {YEARS.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* CVV */}
                  <FormField
                    control={cardForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Save for Later */}
                  <FormField
                    control={cardForm.control}
                    name="saveForLater"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 sm:col-span-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Save this card for future payments</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>For testing, use card number 4242 4242 4242 4242 with any future expiry date and any 3-digit CVV.</p>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Delivery
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Continue to Summary</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* UPI Form */}
          <TabsContent value={PaymentMethod.UPI}>
            <Form {...upiForm}>
              <form onSubmit={upiForm.handleSubmit(onUPISubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* UPI ID */}
                  <FormField
                    control={upiForm.control}
                    name="upiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="username@bankname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Provider */}
                  <FormField
                    control={upiForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI Provider</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="gpay" id="gpay" />
                              <Label htmlFor="gpay">Google Pay</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="phonepe" id="phonepe" />
                              <Label htmlFor="phonepe">PhonePe</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paytm" id="paytm" />
                              <Label htmlFor="paytm">Paytm</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Delivery
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Continue to Summary</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Wallet Form */}
          <TabsContent value={PaymentMethod.WALLET}>
            <Form {...walletForm}>
              <form onSubmit={walletForm.handleSubmit(onWalletSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Wallet Provider */}
                  <FormField
                    control={walletForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wallet Provider *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Select wallet provider</option>
                            {WALLET_PROVIDERS.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Mobile Number */}
                  <FormField
                    control={walletForm.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Delivery
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Continue to Summary</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Bank Transfer Form */}
          <TabsContent value={PaymentMethod.BANK_TRANSFER}>
            <Form {...bankTransferForm}>
              <form onSubmit={bankTransferForm.handleSubmit(onBankTransferSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {/* Bank Name */}
                  <FormField
                    control={bankTransferForm.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name *</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="" disabled>Select bank</option>
                            {BANKS.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Account Number */}
                  <FormField
                    control={bankTransferForm.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* IFSC Code */}
                  <FormField
                    control={bankTransferForm.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="11-character IFSC code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Delivery
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Continue to Summary</>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          {/* Cash on Delivery */}
          <TabsContent value={PaymentMethod.COD}>
            <div className="space-y-6">
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium mb-2 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Cash on Delivery
                </h3>
                <p className="text-muted-foreground mb-2">
                  Pay with cash when your order is delivered. Please have the exact amount ready for the delivery person.
                </p>
                <p className="font-medium">
                  Total amount to be paid: {formatCurrency(orderTotal)}
                </p>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Delivery
                </Button>
                <Button onClick={handleCODSelection}>
                  Continue to Summary
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
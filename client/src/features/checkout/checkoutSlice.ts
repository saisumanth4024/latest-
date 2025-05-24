import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import {
  CheckoutStep,
  PaymentMethod,
  DeliveryTimeSlot,
  PaymentDetails,
  OTPVerification,
  PaymentStatus,
  OrderStatus,
  Order,
  Transaction,
  SavedPaymentMethod,
} from '@/types/checkout';
import { Address } from '@/types/cart';
import { apiRequest } from '@/lib/queryClient';

// Initial mock data for delivery slots - in a real app, this would come from the API
const mockDeliverySlots: DeliveryTimeSlot[] = [
  {
    id: 'slot-1',
    date: '2025-05-25',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    available: true,
  },
  {
    id: 'slot-2',
    date: '2025-05-25',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    available: true,
  },
  {
    id: 'slot-3',
    date: '2025-05-25',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    available: true,
  },
  {
    id: 'slot-4',
    date: '2025-05-26',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    available: true,
  },
  {
    id: 'slot-5',
    date: '2025-05-26',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    fee: 4.99,
    available: true,
  },
  {
    id: 'slot-6',
    date: '2025-05-26',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    available: false,
  },
  {
    id: 'slot-7',
    date: '2025-05-27',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    fee: 7.99,
    available: true,
  },
  {
    id: 'slot-8',
    date: '2025-05-27',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    available: true,
  },
  {
    id: 'slot-9',
    date: '2025-05-27',
    startTime: '4:00 PM',
    endTime: '6:00 PM',
    available: true,
  },
];

// Initial mock data for saved payment methods - in a real app, this would come from the API
const mockSavedPaymentMethods: SavedPaymentMethod[] = [
  {
    id: 'pm-1',
    userId: '1',
    type: PaymentMethod.CREDIT_CARD,
    cardBrand: 'Visa',
    maskedNumber: '**** **** **** 4242',
    cardExpiry: '09/27',
    lastUsed: '2025-04-15T14:22:36Z',
    isDefault: true,
  },
  {
    id: 'pm-2',
    userId: '1',
    type: PaymentMethod.UPI,
    upiId: 'user@bank',
    lastUsed: '2025-03-21T09:12:45Z',
    isDefault: false,
  },
];

// Async thunk for fetching delivery slots
export const fetchDeliverySlots = createAsyncThunk(
  'checkout/fetchDeliverySlots',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiRequest('GET', '/api/delivery-slots');
      // return response.data;
      
      // For demo, we'll just return the mock data after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDeliverySlots;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch delivery slots');
    }
  }
);

// Async thunk for requesting OTP
export const requestOTP = createAsyncThunk(
  'checkout/requestOTP',
  async ({ phoneNumber, email }: { phoneNumber: string; email?: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiRequest('POST', '/api/request-otp', { phoneNumber, email });
      // return response.data;
      
      // For demo, we'll just create a mock OTP verification object
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        phoneNumber,
        email,
        requestId: 'req-' + Math.random().toString(36).substring(2, 10),
        otp: '', // This will be filled in by the user
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
        attempts: 0,
        maxAttempts: 3,
        isVerified: false,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to request OTP');
    }
  }
);

// Async thunk for verifying OTP
export const verifyOTP = createAsyncThunk(
  'checkout/verifyOTP',
  async ({ requestId, otp }: { requestId: string; otp: string }, { getState, rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiRequest('POST', '/api/verify-otp', { requestId, otp });
      // return response.data;
      
      // For demo, we'll just verify if the OTP is '123456'
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const state = getState() as RootState;
      const otpVerification = state.checkout.otpVerification;
      
      if (!otpVerification) {
        throw new Error('No active OTP verification session');
      }
      
      if (otpVerification.attempts >= otpVerification.maxAttempts) {
        throw new Error('Maximum attempts exceeded');
      }
      
      if (new Date(otpVerification.expiresAt) < new Date()) {
        throw new Error('OTP has expired');
      }
      
      // For demo purposes, any 6-digit OTP is valid
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        throw new Error('Invalid OTP format');
      }
      
      // For demo, we'll accept any 6-digit OTP
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify OTP');
    }
  }
);

// Async thunk for processing payment
export const processPayment = createAsyncThunk(
  'checkout/processPayment',
  async (
    { paymentDetails, amount }: { paymentDetails: PaymentDetails; amount: number },
    { rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call to a payment gateway
      // const response = await apiRequest('POST', '/api/process-payment', { paymentDetails, amount });
      // return response.data;
      
      // For demo, we'll just simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock transaction result
      const transaction: Transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 10),
        paymentMethod: paymentDetails.method,
        status: PaymentStatus.AUTHORIZED,
        amount,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        processorId: 'processor-' + Math.random().toString(36).substring(2, 10),
        processorResponse: 'Payment authorized successfully',
      };
      
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Payment processing failed');
    }
  }
);

// Async thunk for placing an order
export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async (
    { cartId, orderData }: { cartId: string | number; orderData: Partial<Order> },
    { getState, rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiRequest('POST', '/api/orders', { cartId, ...orderData });
      // return response.data;
      
      // For demo, we'll just simulate creating an order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock order
      const order: Order = {
        id: 'ord-' + Math.random().toString(36).substring(2, 10),
        userId: orderData.userId,
        guestId: orderData.guestId,
        status: OrderStatus.CONFIRMED,
        items: orderData.items || [],
        totals: orderData.totals || { subtotal: 0, discountTotal: 0, taxTotal: 0, shippingTotal: 0, total: 0, currency: 'USD' },
        billingAddress: orderData.billingAddress!,
        shippingAddress: orderData.shippingAddress!,
        shippingMethod: orderData.shippingMethod!,
        deliverySlot: orderData.deliverySlot,
        paymentMethod: orderData.paymentMethod!,
        placedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        transaction: (getState() as RootState).checkout.transaction,
        notes: orderData.notes,
      };
      
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

// Define checkout state interface
interface CheckoutState {
  activeStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  billingAddress: Address | null;
  shippingAddress: Address | null;
  sameAddress: boolean;
  deliverySlots: DeliveryTimeSlot[];
  selectedDeliverySlot: DeliveryTimeSlot | null;
  selectedPaymentMethod: PaymentMethod | null;
  paymentDetails: PaymentDetails | null;
  savedPaymentMethods: SavedPaymentMethod[];
  otpVerification: OTPVerification | null;
  orderTotal: number;
  order: Order | null;
  transaction: Transaction | null;
  processingPayment: boolean;
  placingOrder: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CheckoutState = {
  activeStep: CheckoutStep.ADDRESS,
  completedSteps: [],
  billingAddress: null,
  shippingAddress: null,
  sameAddress: true,
  deliverySlots: [],
  selectedDeliverySlot: null,
  selectedPaymentMethod: null,
  paymentDetails: null,
  savedPaymentMethods: mockSavedPaymentMethods,
  otpVerification: null,
  orderTotal: 0,
  order: null,
  transaction: null,
  processingPayment: false,
  placingOrder: false,
  loading: false,
  error: null,
};

// Create checkout slice
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<CheckoutStep>) => {
      const prevStep = state.activeStep;
      state.activeStep = action.payload;
      
      // Add the previous step to completed steps if moving forward
      const stepOrder = Object.values(CheckoutStep);
      const prevIndex = stepOrder.indexOf(prevStep);
      const newIndex = stepOrder.indexOf(action.payload);
      
      if (newIndex > prevIndex && !state.completedSteps.includes(prevStep)) {
        state.completedSteps.push(prevStep);
      }
    },
    
    setBillingAddress: (state, action: PayloadAction<Address>) => {
      state.billingAddress = action.payload;
      if (state.sameAddress) {
        state.shippingAddress = action.payload;
      }
    },
    
    setShippingAddress: (state, action: PayloadAction<Address>) => {
      state.shippingAddress = action.payload;
      state.sameAddress = false;
    },
    
    setSameAddress: (state, action: PayloadAction<boolean>) => {
      state.sameAddress = action.payload;
      if (action.payload && state.billingAddress) {
        state.shippingAddress = state.billingAddress;
      }
    },
    
    setSelectedDeliverySlot: (state, action: PayloadAction<DeliveryTimeSlot>) => {
      state.selectedDeliverySlot = action.payload;
    },
    
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
    },
    
    setPaymentDetails: (state, action: PayloadAction<PaymentDetails>) => {
      state.paymentDetails = action.payload;
    },
    
    updateOTPVerification: (state, action: PayloadAction<Partial<OTPVerification>>) => {
      if (state.otpVerification) {
        state.otpVerification = {
          ...state.otpVerification,
          ...action.payload,
        };
      }
    },
    
    setOrderTotal: (state, action: PayloadAction<number>) => {
      state.orderTotal = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetCheckout: (state) => {
      return {
        ...initialState,
        // Preserve the saved payment methods
        savedPaymentMethods: state.savedPaymentMethods,
      };
    },
  },
  extraReducers: (builder) => {
    // Handle fetchDeliverySlots
    builder
      .addCase(fetchDeliverySlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliverySlots.fulfilled, (state, action) => {
        state.loading = false;
        state.deliverySlots = action.payload;
      })
      .addCase(fetchDeliverySlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Handle requestOTP
    builder
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerification = action.payload;
        state.activeStep = CheckoutStep.OTP_VERIFICATION;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Handle verifyOTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        if (state.otpVerification) {
          state.otpVerification.isVerified = true;
          state.activeStep = CheckoutStep.SUMMARY;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        
        // Increment attempts
        if (state.otpVerification) {
          state.otpVerification.attempts += 1;
        }
      });
    
    // Handle processPayment
    builder
      .addCase(processPayment.pending, (state) => {
        state.processingPayment = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.processingPayment = false;
        state.transaction = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.error = action.payload as string;
      });
    
    // Handle placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.order = action.payload;
        state.activeStep = CheckoutStep.CONFIRMATION;
        
        // Mark all previous steps as completed
        state.completedSteps = Object.values(CheckoutStep).filter(
          (step) => step !== CheckoutStep.CONFIRMATION
        );
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setActiveStep,
  setBillingAddress,
  setShippingAddress,
  setSameAddress,
  setSelectedDeliverySlot,
  setSelectedPaymentMethod,
  setPaymentDetails,
  updateOTPVerification,
  setOrderTotal,
  clearError,
  resetCheckout,
} = checkoutSlice.actions;

// Export selectors
export const selectActiveStep = (state: RootState) => state.checkout.activeStep;
export const selectCompletedSteps = (state: RootState) => state.checkout.completedSteps;
export const selectBillingAddress = (state: RootState) => state.checkout.billingAddress;
export const selectShippingAddress = (state: RootState) => state.checkout.shippingAddress;
export const selectSameAddress = (state: RootState) => state.checkout.sameAddress;
export const selectDeliverySlots = (state: RootState) => state.checkout.deliverySlots;
export const selectSelectedDeliverySlot = (state: RootState) => state.checkout.selectedDeliverySlot;
export const selectSelectedPaymentMethod = (state: RootState) => state.checkout.selectedPaymentMethod;
export const selectPaymentDetails = (state: RootState) => state.checkout.paymentDetails;
export const selectSavedPaymentMethods = (state: RootState) => state.checkout.savedPaymentMethods;
export const selectOTPVerification = (state: RootState) => state.checkout.otpVerification;
export const selectOrderTotal = (state: RootState) => state.checkout.orderTotal;
export const selectOrder = (state: RootState) => state.checkout.order;
export const selectTransaction = (state: RootState) => state.checkout.transaction;
export const selectProcessingPayment = (state: RootState) => state.checkout.processingPayment;
export const selectPlacingOrder = (state: RootState) => state.checkout.placingOrder;
export const selectCheckoutLoading = (state: RootState) => state.checkout.loading;
export const selectCheckoutError = (state: RootState) => state.checkout.error;

// Export reducer
export default checkoutSlice.reducer;
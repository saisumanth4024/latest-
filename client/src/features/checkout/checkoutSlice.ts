import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { 
  CheckoutState, 
  CheckoutStep, 
  DeliveryTimeSlot, 
  PaymentMethod, 
  PaymentDetails,
  Order,
  OrderStatus,
  PaymentStatus,
  OTPVerification,
  SavedPaymentMethod
} from '@/types/checkout';
import { Address } from '@/types/cart';
import { RootState } from '@/app/store';

// Initial state
const initialState: CheckoutState = {
  activeStep: CheckoutStep.ADDRESS,
  completedSteps: [],
  sameAddress: true,
  availableDeliverySlots: [],
  savedPaymentMethods: [],
  orderTotal: 0,
  processingPayment: false,
  placingOrder: false
};

// Generate mockup delivery slots for the next 7 days
export const fetchDeliverySlots = createAsyncThunk(
  'checkout/fetchDeliverySlots',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const slots: DeliveryTimeSlot[] = [];
      const now = new Date();
      
      // Generate slots for the next 7 days
      for (let i = 1; i <= 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Morning slot
        slots.push({
          id: uuidv4(),
          date: dateStr,
          startTime: '09:00',
          endTime: '12:00',
          available: Math.random() > 0.2, // 80% chance of availability
        });
        
        // Afternoon slot
        slots.push({
          id: uuidv4(),
          date: dateStr,
          startTime: '13:00',
          endTime: '16:00',
          available: Math.random() > 0.3,
        });
        
        // Evening slot
        slots.push({
          id: uuidv4(),
          date: dateStr,
          startTime: '17:00',
          endTime: '20:00',
          available: Math.random() > 0.4,
          fee: i <= 2 ? 5 : undefined, // Express delivery fee for next 2 days
        });
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return slots;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Fetch saved payment methods
export const fetchSavedPaymentMethods = createAsyncThunk(
  'checkout/fetchSavedPaymentMethods',
  async (userId: string | number, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // Here we'll return mock data
      const savedMethods: SavedPaymentMethod[] = [
        {
          id: uuidv4(),
          type: PaymentMethod.CREDIT_CARD,
          isDefault: true,
          lastUsed: new Date().toISOString(),
          nickname: 'Personal Card',
          maskedNumber: '•••• •••• •••• 4242',
          cardBrand: 'Visa',
          cardExpiry: '12/25',
        },
        {
          id: uuidv4(),
          type: PaymentMethod.UPI,
          isDefault: false,
          lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          upiId: 'user@okbank',
        },
        {
          id: uuidv4(),
          type: PaymentMethod.WALLET,
          isDefault: false,
          walletProvider: 'PayEase',
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return savedMethods;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Process payment
export const processPayment = createAsyncThunk(
  'checkout/processPayment',
  async (
    { paymentDetails, amount }: { paymentDetails: PaymentDetails; amount: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Simulate processing payment
      dispatch(setProcessingPayment(true));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Randomly simulate failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Payment processing failed. Please try again.');
      }
      
      // Return success response
      const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        id: transactionId,
        paymentMethod: paymentDetails.method,
        status: PaymentStatus.COMPLETED,
        amount,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        processorId: `proc_${Math.random().toString(36).substring(2, 10)}`,
        processorResponse: 'Approved',
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    } finally {
      dispatch(setProcessingPayment(false));
    }
  }
);

// Place order
export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async (
    { 
      cartId, 
      orderData 
    }: { 
      cartId: string | number; 
      orderData: Partial<Order>;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(setPlacingOrder(true));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate unique order ID
      const orderId = `ORD-${Math.random().toString(36).substring(2, 6)}-${Date.now().toString().substring(9)}`;
      
      // Create order object
      const order: Order = {
        ...orderData,
        id: orderId,
        status: OrderStatus.CONFIRMED,
        placedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        trackingUrl: `https://trackingsystem.com/track/${orderId}`,
      } as Order;
      
      return order;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    } finally {
      dispatch(setPlacingOrder(false));
    }
  }
);

// Request OTP for verification
export const requestOTP = createAsyncThunk(
  'checkout/requestOTP',
  async (
    { phoneNumber, email }: { phoneNumber: string; email?: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call to request OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock request ID
      const requestId = `req_${Math.random().toString(36).substring(2, 15)}`;
      
      // Set expiry time (5 minutes from now)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      
      return {
        phoneNumber,
        email,
        requestId,
        otp: '',
        expiresAt,
        attempts: 0,
        maxAttempts: 3,
        isVerified: false,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  'checkout/verifyOTP',
  async (
    { requestId, otp }: { requestId: string; otp: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { otpVerification } = state.checkout;
      
      if (!otpVerification) {
        throw new Error('No active OTP verification session');
      }
      
      if (otpVerification.attempts >= otpVerification.maxAttempts) {
        throw new Error('Maximum verification attempts exceeded');
      }
      
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, any 6-digit OTP is considered valid
      const isValid = /^\d{6}$/.test(otp);
      
      if (!isValid) {
        throw new Error('Invalid OTP format');
      }
      
      // Demo validation (in real app, this would be server-side)
      // For demo, we'll accept "123456" as the valid OTP
      if (otp !== '123456') {
        throw new Error('Incorrect OTP');
      }
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Set active checkout step
    setActiveStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.activeStep = action.payload;
      
      // If going backwards, don't modify completed steps
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    
    // Reset checkout state
    resetCheckout: (state) => {
      return {
        ...initialState,
        // Keep saved addresses and payment methods
        billingAddress: state.billingAddress,
        shippingAddress: state.shippingAddress,
        savedPaymentMethods: state.savedPaymentMethods,
      };
    },
    
    // Set billing address
    setBillingAddress: (state, action: PayloadAction<Address>) => {
      state.billingAddress = action.payload;
      
      // If same address is true, also update shipping address
      if (state.sameAddress) {
        state.shippingAddress = action.payload;
      }
    },
    
    // Set shipping address
    setShippingAddress: (state, action: PayloadAction<Address>) => {
      state.shippingAddress = action.payload;
    },
    
    // Toggle same address flag
    toggleSameAddress: (state, action: PayloadAction<boolean>) => {
      state.sameAddress = action.payload;
      
      // If toggling to true, copy billing address to shipping
      if (action.payload && state.billingAddress) {
        state.shippingAddress = state.billingAddress;
      }
    },
    
    // Set selected delivery slot
    setSelectedDeliverySlot: (state, action: PayloadAction<DeliveryTimeSlot>) => {
      state.selectedDeliverySlot = action.payload;
    },
    
    // Set selected payment method
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
    },
    
    // Set payment details
    setPaymentDetails: (state, action: PayloadAction<PaymentDetails>) => {
      state.paymentDetails = action.payload;
    },
    
    // Set order total
    setOrderTotal: (state, action: PayloadAction<number>) => {
      state.orderTotal = action.payload;
    },
    
    // Set processing payment flag
    setProcessingPayment: (state, action: PayloadAction<boolean>) => {
      state.processingPayment = action.payload;
    },
    
    // Set placing order flag
    setPlacingOrder: (state, action: PayloadAction<boolean>) => {
      state.placingOrder = action.payload;
    },
    
    // Update OTP verification state
    updateOTPVerification: (state, action: PayloadAction<Partial<OTPVerification>>) => {
      if (state.otpVerification) {
        state.otpVerification = {
          ...state.otpVerification,
          ...action.payload,
        };
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch delivery slots
      .addCase(fetchDeliverySlots.fulfilled, (state, action) => {
        state.availableDeliverySlots = action.payload;
      })
      .addCase(fetchDeliverySlots.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Fetch saved payment methods
      .addCase(fetchSavedPaymentMethods.fulfilled, (state, action) => {
        state.savedPaymentMethods = action.payload;
      })
      .addCase(fetchSavedPaymentMethods.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Process payment
      .addCase(processPayment.fulfilled, (state, action) => {
        state.processingPayment = false;
        if (state.order) {
          state.order.transaction = action.payload;
        }
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.processingPayment = false;
        state.error = action.payload as string;
      })
      
      // Place order
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.order = action.payload;
        state.activeStep = CheckoutStep.CONFIRMATION;
        state.completedSteps.push(CheckoutStep.SUMMARY);
        state.completedSteps.push(CheckoutStep.CONFIRMATION);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload as string;
      })
      
      // Request OTP
      .addCase(requestOTP.fulfilled, (state, action) => {
        state.otpVerification = action.payload;
        state.activeStep = CheckoutStep.OTP_VERIFICATION;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Verify OTP
      .addCase(verifyOTP.fulfilled, (state) => {
        if (state.otpVerification) {
          state.otpVerification.isVerified = true;
        }
        state.activeStep = CheckoutStep.PAYMENT;
        state.completedSteps.push(CheckoutStep.OTP_VERIFICATION);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        if (state.otpVerification) {
          state.otpVerification.attempts += 1;
        }
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setActiveStep,
  resetCheckout,
  setBillingAddress,
  setShippingAddress,
  toggleSameAddress,
  setSelectedDeliverySlot,
  setSelectedPaymentMethod,
  setPaymentDetails,
  setOrderTotal,
  setProcessingPayment,
  setPlacingOrder,
  updateOTPVerification,
  clearError,
} = checkoutSlice.actions;

// Export selectors
export const selectCheckout = (state: RootState) => state.checkout;
export const selectActiveStep = (state: RootState) => state.checkout.activeStep;
export const selectCompletedSteps = (state: RootState) => state.checkout.completedSteps;
export const selectBillingAddress = (state: RootState) => state.checkout.billingAddress;
export const selectShippingAddress = (state: RootState) => state.checkout.shippingAddress;
export const selectSameAddress = (state: RootState) => state.checkout.sameAddress;
export const selectDeliverySlots = (state: RootState) => state.checkout.availableDeliverySlots;
export const selectSelectedDeliverySlot = (state: RootState) => state.checkout.selectedDeliverySlot;
export const selectSelectedPaymentMethod = (state: RootState) => state.checkout.selectedPaymentMethod;
export const selectPaymentDetails = (state: RootState) => state.checkout.paymentDetails;
export const selectSavedPaymentMethods = (state: RootState) => state.checkout.savedPaymentMethods;
export const selectOrderTotal = (state: RootState) => state.checkout.orderTotal;
export const selectOTPVerification = (state: RootState) => state.checkout.otpVerification;
export const selectOrder = (state: RootState) => state.checkout.order;
export const selectCheckoutError = (state: RootState) => state.checkout.error;
export const selectProcessingPayment = (state: RootState) => state.checkout.processingPayment;
export const selectPlacingOrder = (state: RootState) => state.checkout.placingOrder;

// Export reducer
export default checkoutSlice.reducer;
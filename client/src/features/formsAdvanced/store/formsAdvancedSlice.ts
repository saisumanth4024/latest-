import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

// Types for form fields
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AccountInfo {
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  receiveNewsletters: boolean;
}

export interface ContactMethod {
  type: 'email' | 'phone' | 'social';
  value: string;
  isPrimary: boolean;
  label?: string;
}

export interface FormWizardState {
  currentStep: number;
  completedSteps: number[];
  personal: PersonalInfo;
  addresses: AddressInfo[];
  account: AccountInfo;
  contactMethods: ContactMethod[];
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
}

// Initial state for the form wizard
const initialState: FormWizardState = {
  currentStep: 1,
  completedSteps: [],
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
  },
  addresses: [
    {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: true,
    }
  ],
  account: {
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    receiveNewsletters: false,
  },
  contactMethods: [
    {
      type: 'email',
      value: '',
      isPrimary: true,
      label: 'Primary Email',
    }
  ],
  isSubmitting: false,
  isSubmitted: false,
  submitError: null,
};

// Create the slice
export const formsAdvancedSlice = createSlice({
  name: 'formsAdvanced',
  initialState,
  reducers: {
    // Navigate between steps
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    // Mark a step as completed
    markStepCompleted: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    
    // Update personal information
    updatePersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
      state.personal = action.payload;
    },
    
    // Update account information
    updateAccountInfo: (state, action: PayloadAction<AccountInfo>) => {
      state.account = action.payload;
    },
    
    // Field array operations for addresses
    addAddress: (state) => {
      state.addresses.push({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
      });
    },
    
    updateAddress: (state, action: PayloadAction<{ index: number; address: AddressInfo }>) => {
      const { index, address } = action.payload;
      if (index >= 0 && index < state.addresses.length) {
        state.addresses[index] = address;
      }
    },
    
    removeAddress: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.addresses.length) {
        // Don't remove the last address
        if (state.addresses.length > 1) {
          state.addresses = state.addresses.filter((_, i) => i !== index);
        }
      }
    },
    
    // Field array operations for contact methods
    addContactMethod: (state, action: PayloadAction<{ type: 'email' | 'phone' | 'social' }>) => {
      const { type } = action.payload;
      state.contactMethods.push({
        type,
        value: '',
        isPrimary: false,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      });
    },
    
    updateContactMethod: (state, action: PayloadAction<{ index: number; method: ContactMethod }>) => {
      const { index, method } = action.payload;
      if (index >= 0 && index < state.contactMethods.length) {
        state.contactMethods[index] = method;
      }
    },
    
    removeContactMethod: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.contactMethods.length) {
        // Don't remove the last contact method
        if (state.contactMethods.length > 1) {
          state.contactMethods = state.contactMethods.filter((_, i) => i !== index);
        }
      }
    },
    
    // Form submission status
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    
    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },
    
    setSubmitError: (state, action: PayloadAction<string | null>) => {
      state.submitError = action.payload;
    },
    
    // Reset the entire form
    resetForm: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  setCurrentStep,
  markStepCompleted,
  updatePersonalInfo,
  updateAccountInfo,
  addAddress,
  updateAddress,
  removeAddress,
  addContactMethod,
  updateContactMethod,
  removeContactMethod,
  setSubmitting,
  setSubmitted,
  setSubmitError,
  resetForm,
} = formsAdvancedSlice.actions;

// Selectors
export const selectCurrentStep = (state: RootState) => state.formsAdvanced.currentStep;
export const selectCompletedSteps = (state: RootState) => state.formsAdvanced.completedSteps;
export const selectPersonalInfo = (state: RootState) => state.formsAdvanced.personal;
export const selectAddresses = (state: RootState) => state.formsAdvanced.addresses;
export const selectAccountInfo = (state: RootState) => state.formsAdvanced.account;
export const selectContactMethods = (state: RootState) => state.formsAdvanced.contactMethods;
export const selectSubmitStatus = (state: RootState) => ({
  isSubmitting: state.formsAdvanced.isSubmitting,
  isSubmitted: state.formsAdvanced.isSubmitted,
  submitError: state.formsAdvanced.submitError,
});

export default formsAdvancedSlice.reducer;
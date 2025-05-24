import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

export type SignupStep = 'account' | 'profile' | 'preferences' | 'review';

interface SignupWizardState {
  activeStep: SignupStep;
  completedSteps: SignupStep[];
  formData: {
    // Account information
    username: string;
    email: string;
    password: string;
    
    // Profile information
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    
    // Preferences
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
    marketingEmails: boolean;
    privacySettings: {
      profileVisibility: 'public' | 'private' | 'connections';
      showActivity: boolean;
    };
  };
  isSubmitting: boolean;
  error: string | null;
}

const initialState: SignupWizardState = {
  activeStep: 'account',
  completedSteps: [],
  formData: {
    username: '',
    email: '',
    password: '',
    
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    
    theme: 'system',
    emailNotifications: true,
    marketingEmails: false,
    privacySettings: {
      profileVisibility: 'public',
      showActivity: true,
    },
  },
  isSubmitting: false,
  error: null,
};

export const signupWizardSlice = createSlice({
  name: 'signupWizard',
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<SignupStep>) => {
      state.activeStep = action.payload;
    },
    
    completeStep: (state, action: PayloadAction<SignupStep>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    
    setAccountData: (state, action: PayloadAction<{
      username: string;
      email: string;
      password: string;
    }>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      if (!state.completedSteps.includes('account')) {
        state.completedSteps.push('account');
      }
      state.activeStep = 'profile';
    },
    
    setProfileData: (state, action: PayloadAction<{
      firstName: string;
      lastName: string;
      displayName: string;
      bio: string;
    }>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      if (!state.completedSteps.includes('profile')) {
        state.completedSteps.push('profile');
      }
      state.activeStep = 'preferences';
    },
    
    setPreferencesData: (state, action: PayloadAction<{
      theme: 'light' | 'dark' | 'system';
      emailNotifications: boolean;
      marketingEmails: boolean;
      privacySettings: {
        profileVisibility: 'public' | 'private' | 'connections';
        showActivity: boolean;
      };
    }>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      if (!state.completedSteps.includes('preferences')) {
        state.completedSteps.push('preferences');
      }
      state.activeStep = 'review';
    },
    
    startSubmitting: (state) => {
      state.isSubmitting = true;
      state.error = null;
    },
    
    finishSubmitting: (state) => {
      state.isSubmitting = false;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isSubmitting = false;
    },
    
    resetWizard: () => initialState,
  },
});

export const {
  setActiveStep,
  completeStep,
  setAccountData,
  setProfileData,
  setPreferencesData,
  startSubmitting,
  finishSubmitting,
  setError,
  resetWizard,
} = signupWizardSlice.actions;

// Selectors
export const selectSignupWizardState = (state: RootState) => state.signupWizard;
export const selectActiveStep = (state: RootState) => state.signupWizard.activeStep;
export const selectCompletedSteps = (state: RootState) => state.signupWizard.completedSteps;
export const selectSignupFormData = (state: RootState) => state.signupWizard.formData;
export const selectIsSubmitting = (state: RootState) => state.signupWizard.isSubmitting;
export const selectSignupError = (state: RootState) => state.signupWizard.error;

export default signupWizardSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { UserProfile, UserRole } from '@/types';
import { api } from '@/utils';
import { localStorage } from '@/utils/storage';

/**
 * Extended user settings and preferences
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    marketing: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    activityVisibility: 'public' | 'private' | 'contacts';
  };
}

/**
 * Interface for social account connections
 */
export interface SocialAccount {
  id: string;
  provider: 'google' | 'github' | 'facebook' | 'twitter' | 'linkedin';
  connected: boolean;
  email?: string;
  username?: string;
  avatar?: string;
  connectedAt?: string;
}

/**
 * Interface for two-factor authentication status and methods
 */
export interface TwoFactorAuth {
  enabled: boolean;
  primary: 'totp' | 'sms' | 'email' | null;
  methods: {
    totp: {
      enabled: boolean;
      verified: boolean;
      setupComplete: boolean;
    };
    sms: {
      enabled: boolean;
      verified: boolean;
      phoneNumber?: string;
    };
    email: {
      enabled: boolean;
      verified: boolean;
      email?: string;
    };
    recoveryKeys: {
      enabled: boolean;
      remaining: number;
      lastGenerated?: string;
    };
  };
}

/**
 * Interface for session information
 */
export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
}

/**
 * Complete profile state in Redux
 */
export interface ProfileState {
  // Basic user information
  user: UserProfile | null;
  
  // User settings and preferences
  settings: UserSettings;
  
  // Connected social accounts
  socialAccounts: SocialAccount[];
  
  // Two-factor authentication status
  twoFactorAuth: TwoFactorAuth;
  
  // Active sessions
  sessions: Session[];
  
  // UI state
  avatarUpload: {
    uploading: boolean;
    progress: number;
    preview: string | null;
    error: string | null;
  };
  
  // Profile editing state
  editingProfile: boolean;
  profileFormErrors: Record<string, string>;
  
  // API state
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

/**
 * Initial state for the profile slice
 */
const initialState: ProfileState = {
  user: null,
  settings: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      inApp: true,
      marketing: false,
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false,
    },
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'contacts',
    },
  },
  socialAccounts: [],
  twoFactorAuth: {
    enabled: false,
    primary: null,
    methods: {
      totp: {
        enabled: false,
        verified: false,
        setupComplete: false,
      },
      sms: {
        enabled: false,
        verified: false,
      },
      email: {
        enabled: false,
        verified: false,
      },
      recoveryKeys: {
        enabled: false,
        remaining: 0,
      },
    },
  },
  sessions: [],
  avatarUpload: {
    uploading: false,
    progress: 0,
    preview: null,
    error: null,
  },
  editingProfile: false,
  profileFormErrors: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Load user settings from localStorage
 */
const loadUserSettingsFromStorage = () => {
  try {
    const savedSettings = localStorage.get('userSettings');
    return savedSettings ? savedSettings : initialState.settings;
  } catch (error) {
    console.error('Failed to load user settings from localStorage:', error);
    return initialState.settings;
  }
};

/**
 * Save user settings to localStorage
 */
const saveUserSettingsToStorage = (settings: UserSettings) => {
  try {
    localStorage.set('userSettings', settings);
  } catch (error) {
    console.error('Failed to save user settings to localStorage:', error);
  }
};

/**
 * Async thunk to fetch user profile
 */
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const { data, error } = await api.get(`/api/users/${userId}`);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to fetch user profile');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

/**
 * Async thunk to update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { user } = state.profile;
      
      if (!user) {
        return rejectWithValue('No user profile to update');
      }
      
      const { data, error } = await api.patch(`/api/users/${user.id}`, profileData);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to update user profile');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user profile');
    }
  }
);

/**
 * Async thunk to upload user avatar
 */
export const uploadUserAvatar = createAsyncThunk(
  'profile/uploadUserAvatar',
  async (
    { file, userId }: { file: File; userId: string | number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Mock progress updates (in a real app, this would use proper upload progress)
      const progressInterval = setInterval(() => {
        const randomIncrement = Math.floor(Math.random() * 20);
        dispatch(updateAvatarProgress(randomIncrement));
      }, 500);
      
      // API call to upload avatar
      const { data, error } = await api.post(`/api/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      clearInterval(progressInterval);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to upload avatar');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

/**
 * Async thunk to fetch user sessions
 */
export const fetchUserSessions = createAsyncThunk(
  'profile/fetchUserSessions',
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const { data, error } = await api.get(`/api/users/${userId}/sessions`);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to fetch user sessions');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user sessions');
    }
  }
);

/**
 * Async thunk to terminate a user session
 */
export const terminateSession = createAsyncThunk(
  'profile/terminateSession',
  async (
    { userId, sessionId }: { userId: string | number; sessionId: string },
    { rejectWithValue }
  ) => {
    try {
      const { error } = await api.delete(`/api/users/${userId}/sessions/${sessionId}`);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to terminate session');
      }
      
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to terminate session');
    }
  }
);

/**
 * Async thunk to fetch connected social accounts
 */
export const fetchSocialAccounts = createAsyncThunk(
  'profile/fetchSocialAccounts',
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const { data, error } = await api.get(`/api/users/${userId}/social-accounts`);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to fetch social accounts');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch social accounts');
    }
  }
);

/**
 * Async thunk to connect a social account
 */
export const connectSocialAccount = createAsyncThunk(
  'profile/connectSocialAccount',
  async (
    { 
      userId, 
      provider, 
      code 
    }: { 
      userId: string | number; 
      provider: string; 
      code: string 
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await api.post(`/api/users/${userId}/social-accounts`, {
        provider,
        code,
      });
      
      if (error) {
        return rejectWithValue(error.message || `Failed to connect ${provider} account`);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to connect ${provider} account`);
    }
  }
);

/**
 * Async thunk to disconnect a social account
 */
export const disconnectSocialAccount = createAsyncThunk(
  'profile/disconnectSocialAccount',
  async (
    { 
      userId, 
      provider 
    }: { 
      userId: string | number; 
      provider: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { error } = await api.delete(`/api/users/${userId}/social-accounts/${provider}`);
      
      if (error) {
        return rejectWithValue(error.message || `Failed to disconnect ${provider} account`);
      }
      
      return provider;
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to disconnect ${provider} account`);
    }
  }
);

/**
 * Async thunk to fetch 2FA status
 */
export const fetch2FAStatus = createAsyncThunk(
  'profile/fetch2FAStatus',
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const { data, error } = await api.get(`/api/users/${userId}/2fa`);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to fetch 2FA status');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch 2FA status');
    }
  }
);

/**
 * Async thunk to enable a 2FA method
 */
export const enable2FAMethod = createAsyncThunk(
  'profile/enable2FAMethod',
  async (
    { 
      userId, 
      method 
    }: { 
      userId: string | number; 
      method: 'totp' | 'sms' | 'email' | 'recoveryKeys';
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await api.post(`/api/users/${userId}/2fa/${method}/enable`);
      
      if (error) {
        return rejectWithValue(error.message || `Failed to enable ${method} 2FA`);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to enable ${method} 2FA`);
    }
  }
);

/**
 * Async thunk to disable a 2FA method
 */
export const disable2FAMethod = createAsyncThunk(
  'profile/disable2FAMethod',
  async (
    { 
      userId, 
      method 
    }: { 
      userId: string | number; 
      method: 'totp' | 'sms' | 'email' | 'recoveryKeys';
    },
    { rejectWithValue }
  ) => {
    try {
      const { error } = await api.post(`/api/users/${userId}/2fa/${method}/disable`);
      
      if (error) {
        return rejectWithValue(error.message || `Failed to disable ${method} 2FA`);
      }
      
      return method;
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to disable ${method} 2FA`);
    }
  }
);

/**
 * Async thunk to verify a 2FA code
 */
export const verify2FACode = createAsyncThunk(
  'profile/verify2FACode',
  async (
    { 
      userId, 
      method, 
      code 
    }: { 
      userId: string | number; 
      method: 'totp' | 'sms' | 'email'; 
      code: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await api.post(`/api/users/${userId}/2fa/${method}/verify`, {
        code,
      });
      
      if (error) {
        return rejectWithValue(error.message || `Failed to verify ${method} code`);
      }
      
      return { method, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to verify ${method} code`);
    }
  }
);

/**
 * Profile slice
 */
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Set user profile (for initial load or after auth)
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    // Update user settings
    updateUserSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
      
      // Persist settings to localStorage
      saveUserSettingsToStorage(state.settings);
      
      state.lastUpdated = new Date().toISOString();
    },
    
    // Update nested user settings
    updateNestedSettings: (
      state,
      action: PayloadAction<{
        category: keyof UserSettings;
        settings: Partial<any>;
      }>
    ) => {
      const { category, settings } = action.payload;
      
      state.settings[category] = {
        ...state.settings[category],
        ...settings,
      };
      
      // Persist settings to localStorage
      saveUserSettingsToStorage(state.settings);
      
      state.lastUpdated = new Date().toISOString();
    },
    
    // Toggle edit profile mode
    toggleEditProfile: (state) => {
      state.editingProfile = !state.editingProfile;
      
      // Clear form errors when starting to edit
      if (state.editingProfile) {
        state.profileFormErrors = {};
      }
    },
    
    // Set avatar preview during upload process
    setAvatarPreview: (state, action: PayloadAction<string>) => {
      state.avatarUpload.preview = action.payload;
    },
    
    // Clear avatar preview
    clearAvatarPreview: (state) => {
      state.avatarUpload.preview = null;
    },
    
    // Update avatar upload progress
    updateAvatarProgress: (state, action: PayloadAction<number>) => {
      // Ensure progress doesn't exceed 100%
      const newProgress = Math.min(
        100,
        state.avatarUpload.progress + action.payload
      );
      
      state.avatarUpload.progress = newProgress;
    },
    
    // Reset avatar upload state
    resetAvatarUploadState: (state) => {
      state.avatarUpload = initialState.avatarUpload;
    },
    
    // Set profile form errors
    setProfileFormErrors: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.profileFormErrors = action.payload;
    },
    
    // Clear profile form errors
    clearProfileFormErrors: (state) => {
      state.profileFormErrors = {};
    },
    
    // Clear profile error
    clearProfileError: (state) => {
      state.error = null;
    },
    
    // Manual 2FA toggle for demo purposes
    toggleDemo2FA: (state, action: PayloadAction<boolean>) => {
      state.twoFactorAuth.enabled = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    // Initialize from localStorage
    initializeFromStorage: (state) => {
      // Load user settings from localStorage
      state.settings = loadUserSettingsFromStorage();
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      } as UserProfile;
      state.loading = false;
      state.editingProfile = false;
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Upload user avatar
    builder.addCase(uploadUserAvatar.pending, (state) => {
      state.avatarUpload.uploading = true;
      state.avatarUpload.progress = 0;
      state.avatarUpload.error = null;
    });
    builder.addCase(uploadUserAvatar.fulfilled, (state, action) => {
      if (state.user && action.payload.avatarUrl) {
        state.user.avatar = action.payload.avatarUrl;
      }
      state.avatarUpload.uploading = false;
      state.avatarUpload.progress = 100;
      state.avatarUpload.preview = null;
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(uploadUserAvatar.rejected, (state, action) => {
      state.avatarUpload.uploading = false;
      state.avatarUpload.error = action.payload as string;
    });
    
    // Fetch user sessions
    builder.addCase(fetchUserSessions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserSessions.fulfilled, (state, action) => {
      state.sessions = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchUserSessions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Terminate session
    builder.addCase(terminateSession.fulfilled, (state, action) => {
      state.sessions = state.sessions.filter(
        (session) => session.id !== action.payload
      );
    });
    
    // Fetch social accounts
    builder.addCase(fetchSocialAccounts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSocialAccounts.fulfilled, (state, action) => {
      state.socialAccounts = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchSocialAccounts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Connect social account
    builder.addCase(connectSocialAccount.fulfilled, (state, action) => {
      const existingIndex = state.socialAccounts.findIndex(
        (account) => account.provider === action.payload.provider
      );
      
      if (existingIndex >= 0) {
        state.socialAccounts[existingIndex] = action.payload;
      } else {
        state.socialAccounts.push(action.payload);
      }
      
      state.lastUpdated = new Date().toISOString();
    });
    
    // Disconnect social account
    builder.addCase(disconnectSocialAccount.fulfilled, (state, action) => {
      state.socialAccounts = state.socialAccounts.filter(
        (account) => account.provider !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    });
    
    // Fetch 2FA status
    builder.addCase(fetch2FAStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetch2FAStatus.fulfilled, (state, action) => {
      state.twoFactorAuth = action.payload;
      state.loading = false;
    });
    builder.addCase(fetch2FAStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Enable 2FA method
    builder.addCase(enable2FAMethod.fulfilled, (state, action) => {
      const { method, ...data } = action.payload;
      
      if (method === 'totp') {
        state.twoFactorAuth.methods.totp = {
          ...state.twoFactorAuth.methods.totp,
          ...data,
          enabled: true,
        };
      } else if (method === 'sms') {
        state.twoFactorAuth.methods.sms = {
          ...state.twoFactorAuth.methods.sms,
          ...data,
          enabled: true,
        };
      } else if (method === 'email') {
        state.twoFactorAuth.methods.email = {
          ...state.twoFactorAuth.methods.email,
          ...data,
          enabled: true,
        };
      } else if (method === 'recoveryKeys') {
        state.twoFactorAuth.methods.recoveryKeys = {
          ...state.twoFactorAuth.methods.recoveryKeys,
          ...data,
          enabled: true,
        };
      }
      
      // If any method is enabled, set overall 2FA to enabled
      const anyMethodEnabled = 
        state.twoFactorAuth.methods.totp.enabled ||
        state.twoFactorAuth.methods.sms.enabled ||
        state.twoFactorAuth.methods.email.enabled;
      
      state.twoFactorAuth.enabled = anyMethodEnabled;
      
      // Set as primary method if there isn't one yet
      if (anyMethodEnabled && !state.twoFactorAuth.primary) {
        if (state.twoFactorAuth.methods.totp.enabled) {
          state.twoFactorAuth.primary = 'totp';
        } else if (state.twoFactorAuth.methods.sms.enabled) {
          state.twoFactorAuth.primary = 'sms';
        } else if (state.twoFactorAuth.methods.email.enabled) {
          state.twoFactorAuth.primary = 'email';
        }
      }
      
      state.lastUpdated = new Date().toISOString();
    });
    
    // Disable 2FA method
    builder.addCase(disable2FAMethod.fulfilled, (state, action) => {
      const method = action.payload;
      
      if (method === 'totp') {
        state.twoFactorAuth.methods.totp.enabled = false;
      } else if (method === 'sms') {
        state.twoFactorAuth.methods.sms.enabled = false;
      } else if (method === 'email') {
        state.twoFactorAuth.methods.email.enabled = false;
      } else if (method === 'recoveryKeys') {
        state.twoFactorAuth.methods.recoveryKeys.enabled = false;
      }
      
      // If this was the primary method, choose another one or set to null
      if (state.twoFactorAuth.primary === method) {
        if (state.twoFactorAuth.methods.totp.enabled) {
          state.twoFactorAuth.primary = 'totp';
        } else if (state.twoFactorAuth.methods.sms.enabled) {
          state.twoFactorAuth.primary = 'sms';
        } else if (state.twoFactorAuth.methods.email.enabled) {
          state.twoFactorAuth.primary = 'email';
        } else {
          state.twoFactorAuth.primary = null;
        }
      }
      
      // Check if all methods are disabled
      const allDisabled = 
        !state.twoFactorAuth.methods.totp.enabled &&
        !state.twoFactorAuth.methods.sms.enabled &&
        !state.twoFactorAuth.methods.email.enabled;
      
      if (allDisabled) {
        state.twoFactorAuth.enabled = false;
        state.twoFactorAuth.primary = null;
      }
      
      state.lastUpdated = new Date().toISOString();
    });
    
    // Verify 2FA code
    builder.addCase(verify2FACode.fulfilled, (state, action) => {
      const { method, ...data } = action.payload;
      
      if (method === 'totp') {
        state.twoFactorAuth.methods.totp = {
          ...state.twoFactorAuth.methods.totp,
          ...data,
          verified: true,
          setupComplete: true,
        };
      } else if (method === 'sms') {
        state.twoFactorAuth.methods.sms = {
          ...state.twoFactorAuth.methods.sms,
          ...data,
          verified: true,
        };
      } else if (method === 'email') {
        state.twoFactorAuth.methods.email = {
          ...state.twoFactorAuth.methods.email,
          ...data,
          verified: true,
        };
      }
      
      state.lastUpdated = new Date().toISOString();
    });
  },
});

// Extract actions
export const {
  setUserProfile,
  updateUserSettings,
  updateNestedSettings,
  toggleEditProfile,
  setAvatarPreview,
  clearAvatarPreview,
  updateAvatarProgress,
  resetAvatarUploadState,
  setProfileFormErrors,
  clearProfileFormErrors,
  clearProfileError,
  toggleDemo2FA,
  initializeFromStorage,
} = profileSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.profile.user;
export const selectUserSettings = (state: RootState) => state.profile.settings;
export const selectTheme = (state: RootState) => state.profile.settings.theme;
export const selectLanguage = (state: RootState) => state.profile.settings.language;
export const selectAccessibilitySettings = (state: RootState) => state.profile.settings.accessibility;
export const selectNotificationSettings = (state: RootState) => state.profile.settings.notifications;
export const selectPrivacySettings = (state: RootState) => state.profile.settings.privacy;
export const selectSocialAccounts = (state: RootState) => state.profile.socialAccounts;
export const select2FAStatus = (state: RootState) => state.profile.twoFactorAuth;
export const selectSessions = (state: RootState) => state.profile.sessions;
export const selectIsEditingProfile = (state: RootState) => state.profile.editingProfile;
export const selectProfileFormErrors = (state: RootState) => state.profile.profileFormErrors;
export const selectAvatarUploadState = (state: RootState) => state.profile.avatarUpload;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectProfileLastUpdated = (state: RootState) => state.profile.lastUpdated;

export default profileSlice.reducer;
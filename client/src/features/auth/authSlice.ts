import { createSlice, createAsyncThunk, createAction, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { apiRequest } from '@/lib/queryClient';
import { User, UserStatus } from './types';
import type { UserRole } from '@/types';

/**
 * Authentication slice for Redux Toolkit
 * Handles all authentication state management for the application
 */

// Reference to imported User type from ./types.ts

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Authentication state interface
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null;
  sessions: any[];
  // Traditional authentication only
  authMethod: 'traditional';
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  expiresAt: null,
  sessions: [],
  authMethod: 'traditional',
};

// Load persisted auth state if available
try {
  const storages: Storage[] = [localStorage, sessionStorage];
  for (const storage of storages) {
    const token = storage.getItem('auth_token');
    const refreshToken = storage.getItem('auth_refresh_token');
    const expiresAtStr = storage.getItem('auth_expires_at');

    if (token && refreshToken && expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr, 10);
      // Only restore if token hasn't expired
      if (expiresAt && Date.now() < expiresAt * 1000) {
        initialState.token = token;
        initialState.refreshToken = refreshToken;
        initialState.expiresAt = expiresAt;
        initialState.isAuthenticated = true;
        break;
      } else {
        storage.removeItem('auth_token');
        storage.removeItem('auth_refresh_token');
        storage.removeItem('auth_expires_at');
      }
    }
  }
} catch (error) {
  // If there's any error parsing the stored auth state, reset to default
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_refresh_token');
  localStorage.removeItem('auth_expires_at');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_refresh_token');
  sessionStorage.removeItem('auth_expires_at');
}

// Login async thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Call our traditional login API endpoint
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Store auth data for persistence
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem('auth_token', data.token);
      storage.setItem('auth_refresh_token', data.refreshToken);
      storage.setItem('auth_expires_at', data.expiresAt.toString());
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Temporary empty function to satisfy imports while transitioning away from Replit auth
export const fetchReplitUser = createAsyncThunk(
  'auth/fetchReplitUser',
  async (_, { rejectWithValue }) => {
    // This is a no-op function that immediately returns null
    // It exists only to prevent import errors during the transition
    return rejectWithValue('Replit authentication has been removed');
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear all state
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
      state.error = null;
      state.sessions = [];
      
      // Clear ALL auth-related data from localStorage and sessionStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');
      localStorage.removeItem('demoUserRole');
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_refresh_token');
      sessionStorage.removeItem('auth_expires_at');
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Any other auth-related items should be cleared here
      // Don't redirect here - let the component handle the redirect
    },
    setCredentials: (state, action: PayloadAction<{ 
      user: User; 
      token: string; 
      refreshToken: string;
      expiresAt: number;
    }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.isAuthenticated = true;
      state.authMethod = 'traditional';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(githubLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(githubLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.isAuthenticated = true;
      })
      .addCase(githubLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        // Don't set auth state on signup success
        // The user should be redirected to login instead
        // This is intentional as per requirements
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // No Replit auth cases needed
  },
});

// Actions
export const { logout, setCredentials } = authSlice.actions;
// Create a setFormError action from the authSlice actions
export const setFormError = (error: string) => ({
  type: 'auth/setFormError',
  payload: error
});

// Create a clearError action
export const clearError = () => ({
  type: 'auth/clearError',
  payload: null
});

export const setAuthState = (role: UserRole) => (dispatch: any) => {
  const mockUser = {
    id: '1',
    username: 'demouser',
    email: 'demo@example.com',
    role: role,
    status: 'active' as const,
    profileImageUrl: 'https://i.pravatar.cc/150?img=3',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Store user data and tokens in localStorage
  localStorage.setItem('demoUserRole', JSON.stringify({ role: role }));
  
  dispatch(setCredentials({
    user: mockUser,
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  }));
};

// Token expiration check function
export const checkTokenExpiration = () => (dispatch: any, getState: () => RootState) => {
  const state = getState();
  const expiresAt = state.auth.expiresAt;
  
  // No expiration time means no valid token
  if (!expiresAt) {
    return false;
  }
  
  // Convert expiresAt to milliseconds and add buffer time (5 seconds)
  const expiryTimeMs = expiresAt * 1000;
  const currentTimeMs = Date.now();
  const bufferTimeMs = 5000; // 5 seconds buffer to avoid edge cases
  
  // If token is expired or about to expire
  if (currentTimeMs > expiryTimeMs - bufferTimeMs) {
    // If there's a refresh token, try to refresh instead of immediate logout
    if (state.auth.refreshToken) {
      // Try to dispatch refresh token action
      dispatch(refreshToken());
    } else {
      // No refresh token, so just logout
      dispatch(logout());
    }
    return true;
  }
  return false;
};

// Social login functions
export const githubLogin = createAsyncThunk(
  'auth/githubLogin',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/github', { code });
      const data = await response.json();
      
      // Store auth data in whichever storage is currently used
      const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
      storage.setItem('auth_token', data.token);
      storage.setItem('auth_refresh_token', data.refreshToken);
      storage.setItem('auth_expires_at', data.expiresAt.toString());
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'GitHub login failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/google', { token });
      const data = await response.json();
      
      // Store auth data in whichever storage is currently used
      const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
      storage.setItem('auth_token', data.token);
      storage.setItem('auth_refresh_token', data.refreshToken);
      storage.setItem('auth_expires_at', data.expiresAt.toString());
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/signup', userData);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Signup failed');
      }
      
      const data = await response.json();
      
      // IMPORTANT: We intentionally DO NOT:
      // 1. Store auth data in localStorage
      // 2. Set isAuthenticated to true
      // 3. Update auth state with user info or tokens
      //
      // This ensures the user must explicitly log in after signup
      // and prevents the auto-login behavior

      return {
        success: true,
        message: 'Account created successfully',
        email: userData.email // Return email for pre-filling login form
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const refreshTokenValue = state.auth.refreshToken;
      
      if (!refreshTokenValue) {
        return rejectWithValue('No refresh token available');
      }
      
      const response = await apiRequest('POST', '/api/auth/refresh', { refreshToken: refreshTokenValue });
      const data = await response.json();
      
      // Update stored auth data
      const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage;
      storage.setItem('auth_token', data.token);
      storage.setItem('auth_refresh_token', data.refreshToken);
      storage.setItem('auth_expires_at', data.expiresAt.toString());
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const getUserSessions = createAsyncThunk(
  'auth/getUserSessions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      
      if (!state.auth.token) {
        return rejectWithValue('Not authenticated');
      }
      
      const response = await apiRequest('GET', '/api/auth/sessions');
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user sessions');
    }
  }
);

export const revokeSession = createAsyncThunk(
  'auth/revokeSession',
  async (sessionId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      
      if (!state.auth.token) {
        return rejectWithValue('Not authenticated');
      }
      
      await apiRequest('DELETE', `/api/auth/sessions/${sessionId}`);
      
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to revoke session');
    }
  }
);

// Selectors
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectFormError = (state: RootState) => state.auth.error;

export const selectUserRole = (state: RootState) => state.auth.user?.role || ('guest' as UserRole);
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin';
export const selectIsSeller = (state: RootState) => state.auth.user?.role === 'seller';
export const selectIsModerator = (state: RootState) => state.auth.user?.role === 'moderator';
export const selectSessions = (state: RootState) => state.auth.sessions;
export const selectAuthStatus = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  error: state.auth.error
});

export default authSlice.reducer;
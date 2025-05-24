import { createSlice, createAsyncThunk, createAction, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { apiRequest } from '@/lib/queryClient';
import { User, UserStatus } from './types';
import { UserRole } from '@/config/navigation';

/**
 * Enhanced auth slice to support both traditional and Replit authentication methods
 * This addresses the integration issues between competing auth implementations
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
  // Track authentication method for different logout behavior
  authMethod: 'traditional' | 'replit' | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('auth_refresh_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
  expiresAt: localStorage.getItem('auth_expires_at') 
    ? parseInt(localStorage.getItem('auth_expires_at') || '0', 10) 
    : null,
  sessions: [],
  authMethod: localStorage.getItem('auth_method') as ('traditional' | 'replit' | null),
};

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
      
      // Store auth data in localStorage for persistence
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_refresh_token', data.refreshToken);
        localStorage.setItem('auth_expires_at', data.expiresAt.toString());
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Replit Auth thunk
export const fetchReplitUser = createAsyncThunk(
  'auth/fetchReplitUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', '/api/auth/user');
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch user');
      }
      
      const userData = await response.json();
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error fetching user data');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear state
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
      state.authMethod = null;
      state.error = null;
      
      // Clear auth data from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');
      localStorage.removeItem('auth_method');
      localStorage.removeItem('demoUserRole');
      
      // Don't redirect here - let the component handle the redirect
      // This prevents race conditions and improves the user experience
    },
    setCredentials: (state, action: PayloadAction<{ 
      user: User; 
      token: string; 
      refreshToken: string;
      expiresAt: number;
      authMethod?: 'traditional' | 'replit';
    }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.isAuthenticated = true;
      state.authMethod = action.payload.authMethod || 'traditional';
      
      // Store auth method in localStorage
      localStorage.setItem('auth_method', state.authMethod);
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
      // Handle Replit auth
      .addCase(fetchReplitUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReplitUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authMethod = 'replit';
        
        // Store auth method for persistence
        localStorage.setItem('auth_method', 'replit');
      })
      .addCase(fetchReplitUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
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
  
  if (expiresAt && Date.now() > expiresAt * 1000) {
    dispatch(logout());
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
      
      // Store auth data in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_refresh_token', data.refreshToken);
      localStorage.setItem('auth_expires_at', data.expiresAt.toString());
      
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
      
      // Store auth data in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_refresh_token', data.refreshToken);
      localStorage.setItem('auth_expires_at', data.expiresAt.toString());
      
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
      const data = await response.json();
      
      // Store auth data in localStorage on successful signup
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_refresh_token', data.refreshToken);
      localStorage.setItem('auth_expires_at', data.expiresAt.toString());
      
      return data;
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
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_refresh_token', data.refreshToken);
      localStorage.setItem('auth_expires_at', data.expiresAt.toString());
      
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
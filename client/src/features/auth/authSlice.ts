import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { UserRole, AuthStatus, UserProfile, UserCredentials, UserRegistration } from '@/types';
import { api } from '@/utils';
import { localStorage } from '@/utils/storage';

// Define our auth state type
export interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessions: {
    id: string;
    device: string;
    lastActive: string;
    isCurrent: boolean;
  }[];
  // Local state for auth forms to avoid separate slice
  formError: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  status: AuthStatus.IDLE,
  error: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
  isLoading: false,
  sessions: [],
  formError: null,
};

// Helper function to set auth data in localStorage with expiry
const saveAuthToStorage = (
  token: string,
  refreshToken: string,
  expiresAt: string,
  user: UserProfile
) => {
  // Use the standard localStorage API
  window.localStorage.setItem('auth', JSON.stringify({
    token,
    refreshToken,
    expiresAt,
    user,
  }));
};

// Helper function to clear auth data from localStorage
const clearAuthFromStorage = () => {
  // Use the standard localStorage API
  window.localStorage.removeItem('auth');
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: UserCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await api.post('/api/auth/login', credentials);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to login');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to login');
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (registration: UserRegistration, { rejectWithValue }) => {
    try {
      const { data, error } = await api.post('/api/auth/signup', registration);
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to sign up');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sign up');
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await api.post('/api/auth/logout', {});
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to logout');
      }
      
      clearAuthFromStorage();
      return true;
    } catch (error: any) {
      clearAuthFromStorage(); // Still clear locally even if API fails
      return rejectWithValue(error.message || 'Failed to logout');
    }
  }
);

// Async thunk for refreshing the token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }
      
      const { data, error } = await api.post('/api/auth/refresh', { refreshToken });
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to refresh token');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh token');
    }
  }
);

// Async thunk for Google OAuth login
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (tokenId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await api.post('/api/auth/google', { tokenId });
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to login with Google');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to login with Google');
    }
  }
);

// Async thunk for GitHub OAuth login
export const githubLogin = createAsyncThunk(
  'auth/githubLogin',
  async (code: string, { rejectWithValue }) => {
    try {
      const { data, error } = await api.post('/api/auth/github', { code });
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to login with GitHub');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to login with GitHub');
    }
  }
);

// Async thunk for getting user's active sessions
export const getUserSessions = createAsyncThunk(
  'auth/getUserSessions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No auth token available');
      }
      
      const { data, error } = await api.get('/api/auth/sessions');
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to get user sessions');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user sessions');
    }
  }
);

// Async thunk for revoking a specific session
export const revokeSession = createAsyncThunk(
  'auth/revokeSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const { error } = await api.post('/api/auth/sessions/revoke', { sessionId });
      
      if (error) {
        return rejectWithValue(error.message || 'Failed to revoke session');
      }
      
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to revoke session');
    }
  }
);

// Create the auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set auth error (used for form validation)
    setFormError: (state, action: PayloadAction<string | null>) => {
      state.formError = action.payload;
    },
    
    // Action to clear auth error
    clearError: (state) => {
      state.error = null;
      state.formError = null;
    },
    
    // Action to manually set auth state (e.g. from localStorage)
    setAuthState: (state, action: PayloadAction<{
      token: string;
      refreshToken: string;
      expiresAt: string;
      user: UserProfile;
    }>) => {
      const { token, refreshToken, expiresAt, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.user = user;
      state.isAuthenticated = true;
      state.status = AuthStatus.AUTHENTICATED;
    },
    
    // Action to check token expiration and auto-logout
    checkTokenExpiration: (state) => {
      if (state.expiresAt && new Date(state.expiresAt) < new Date()) {
        // Token expired
        state.token = null;
        state.refreshToken = null;
        state.expiresAt = null;
        state.user = null;
        state.isAuthenticated = false;
        state.status = AuthStatus.UNAUTHENTICATED;
        clearAuthFromStorage();
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder.addCase(login.pending, (state) => {
      state.status = AuthStatus.LOADING;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { token, refreshToken, expiresAt, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.user = user;
      state.isAuthenticated = true;
      state.status = AuthStatus.AUTHENTICATED;
      state.isLoading = false;
      state.error = null;
      
      // Save to local storage
      saveAuthToStorage(token, refreshToken, expiresAt, user);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = AuthStatus.ERROR;
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Signup cases
    builder.addCase(signup.pending, (state) => {
      state.status = AuthStatus.LOADING;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      const { token, refreshToken, expiresAt, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.user = user;
      state.isAuthenticated = true;
      state.status = AuthStatus.AUTHENTICATED;
      state.isLoading = false;
      state.error = null;
      
      // Save to local storage
      saveAuthToStorage(token, refreshToken, expiresAt, user);
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.status = AuthStatus.ERROR;
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Logout cases
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      // Reset state to initial values
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.isLoading = false;
      state.error = null;
      state.sessions = [];
    });
    builder.addCase(logout.rejected, (state) => {
      // Still logout locally even if API call fails
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.isLoading = false;
      state.sessions = [];
    });
    
    // Refresh token cases
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      const { token, refreshToken, expiresAt, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.user = user;
      state.isAuthenticated = true;
      state.status = AuthStatus.AUTHENTICATED;
      state.isLoading = false;
      
      // Save to local storage
      saveAuthToStorage(token, refreshToken, expiresAt, user);
    });
    builder.addCase(refreshToken.rejected, (state) => {
      // Token refresh failed, logout
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.isLoading = false;
      state.sessions = [];
      clearAuthFromStorage();
    });
    
    // OAuth login cases (Google)
    builder.addCase(googleLogin.pending, (state) => {
      state.status = AuthStatus.LOADING;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      const { token, refreshToken, expiresAt, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.user = user;
      state.isAuthenticated = true;
      state.status = AuthStatus.AUTHENTICATED;
      state.isLoading = false;
      state.error = null;
      
      // Save to local storage
      saveAuthToStorage(token, refreshToken, expiresAt, user);
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.status = AuthStatus.ERROR;
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // OAuth login cases (GitHub)
    builder.addCase(githubLogin.pending, (state) => {
      state.status = AuthStatus.LOADING;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(githubLogin.fulfilled, (state, action) => {
      const { token, refreshToken, expiresAt, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.expiresAt = expiresAt;
      state.user = user;
      state.isAuthenticated = true;
      state.status = AuthStatus.AUTHENTICATED;
      state.isLoading = false;
      state.error = null;
      
      // Save to local storage
      saveAuthToStorage(token, refreshToken, expiresAt, user);
    });
    builder.addCase(githubLogin.rejected, (state, action) => {
      state.status = AuthStatus.ERROR;
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Session management cases
    builder.addCase(getUserSessions.fulfilled, (state, action) => {
      state.sessions = action.payload;
    });
    builder.addCase(revokeSession.fulfilled, (state, action) => {
      const sessionId = action.payload;
      state.sessions = state.sessions.filter(session => session.id !== sessionId);
    });
  },
});

// Export actions
export const {
  setFormError,
  clearError,
  setAuthState,
  checkTokenExpiration,
} = authSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectFormError = (state: RootState) => state.auth.formError;
export const selectSessions = (state: RootState) => state.auth.sessions;

// Role-specific selectors
export const selectUserRole = (state: RootState) => state.auth.user?.role || UserRole.GUEST;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === UserRole.ADMIN;
export const selectIsSeller = (state: RootState) => state.auth.user?.role === UserRole.SELLER;

export default authSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { AuthState, AuthStatus, LoginCredentials, LoginResponse, RegisterCredentials, User } from './types';
import { mockLogin, mockRegister, validateToken } from './api/mockAuthApi';

// Local storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Helper functions for localStorage
const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

const storeAuthData = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Initial state
const initialState: AuthState = {
  status: AuthStatus.IDLE,
  user: getStoredUser(),
  token: getStoredToken(),
  error: null,
  lastLoginAttempt: undefined
};

// Async thunks
export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await mockLogin(credentials);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
  }
});

export const register = createAsyncThunk<
  LoginResponse,
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await mockRegister(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
  }
});

export const validateUserToken = createAsyncThunk<
  User | null,
  void,
  { state: RootState, rejectValue: string }
>('auth/validateToken', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  
  if (!token) {
    return null;
  }
  
  try {
    const user = await validateToken(token);
    return user;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Token validation failed');
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.status = AuthStatus.UNAUTHENTICATED;
      state.user = null;
      state.token = null;
      state.error = null;
      clearAuthData();
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
        state.lastLoginAttempt = Date.now();
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = AuthStatus.AUTHENTICATED;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        storeAuthData(action.payload.token, action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload || 'Authentication failed';
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = AuthStatus.LOADING;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = AuthStatus.AUTHENTICATED;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        storeAuthData(action.payload.token, action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = AuthStatus.ERROR;
        state.error = action.payload || 'Registration failed';
      })
      
      // Validate token cases
      .addCase(validateUserToken.pending, (state) => {
        state.status = AuthStatus.LOADING;
      })
      .addCase(validateUserToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = AuthStatus.AUTHENTICATED;
          state.user = action.payload;
        } else {
          state.status = AuthStatus.UNAUTHENTICATED;
          state.user = null;
          state.token = null;
          clearAuthData();
        }
      })
      .addCase(validateUserToken.rejected, (state) => {
        state.status = AuthStatus.UNAUTHENTICATED;
        state.user = null;
        state.token = null;
        clearAuthData();
      });
  }
});

// Actions
export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => 
  state.auth.status === AuthStatus.AUTHENTICATED && !!state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.status === AuthStatus.LOADING;

export default authSlice.reducer;
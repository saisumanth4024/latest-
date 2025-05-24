import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  history: {
    path: string;
    timestamp: number;
  }[];
}

const initialState: NavigationState = {
  currentRoute: '/',
  previousRoute: null,
  history: [],
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateTo: (state, action: PayloadAction<string>) => {
      // Store previous route
      state.previousRoute = state.currentRoute;
      
      // Update current route
      state.currentRoute = action.payload;
      
      // Add to history (limited to last 10 entries)
      state.history.unshift({
        path: action.payload,
        timestamp: Date.now(),
      });
      
      // Keep history size manageable
      if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
      }
    },
    clearNavigationHistory: (state) => {
      state.history = [];
    },
  },
});

// Export actions
export const { navigateTo, clearNavigationHistory } = navigationSlice.actions;

// Export selectors
export const selectCurrentRoute = (state: RootState) => state.navigation.currentRoute;
export const selectPreviousRoute = (state: RootState) => state.navigation.previousRoute;
export const selectNavigationHistory = (state: RootState) => state.navigation.history;

export default navigationSlice.reducer;
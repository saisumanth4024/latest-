import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

export interface NavigationState {
  previousPath: string | null;
  currentPath: string | null;
  navigationHistory: string[];
  lastTransitionTime: number | null;
}

const initialState: NavigationState = {
  previousPath: null,
  currentPath: null,
  navigationHistory: [],
  lastTransitionTime: null,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateTo: (state, action: PayloadAction<string>) => {
      // Update previous path
      state.previousPath = state.currentPath;
      
      // Set new current path
      state.currentPath = action.payload;
      
      // Add to history (limited to last 10 entries)
      state.navigationHistory = [
        action.payload,
        ...state.navigationHistory.slice(0, 9)
      ];
      
      // Set transition time
      state.lastTransitionTime = Date.now();
    },
    
    clearHistory: (state) => {
      state.navigationHistory = [];
    },
  },
});

// Export actions
export const { navigateTo, clearHistory } = navigationSlice.actions;

// Export selectors
export const selectCurrentPath = (state: RootState) => state.navigation.currentPath;
export const selectPreviousPath = (state: RootState) => state.navigation.previousPath;
export const selectNavigationHistory = (state: RootState) => state.navigation.navigationHistory;
export const selectLastTransitionTime = (state: RootState) => state.navigation.lastTransitionTime;

export default navigationSlice.reducer;
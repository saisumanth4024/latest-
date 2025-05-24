import { describe, it, expect } from 'vitest';
import navigationReducer, { 
  navigateTo, 
  selectCurrentPath,
  selectPreviousPath,
  selectNavigationHistory,
  initialState 
} from './navigationSlice';

describe('navigation slice', () => {
  it('should return the initial state', () => {
    expect(navigationReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('navigateTo action', () => {
    it('should handle the first navigation', () => {
      const path = '/products';
      const state = navigationReducer(initialState, navigateTo(path));
      
      expect(state.currentPath).toBe(path);
      expect(state.previousPath).toBe(null);
      expect(state.navigationHistory).toEqual([path]);
      expect(state.lastTransitionTime).not.toBeNull();
    });

    it('should handle subsequent navigations', () => {
      // First navigation
      let state = navigationReducer(initialState, navigateTo('/home'));
      
      // Second navigation
      state = navigationReducer(state, navigateTo('/products'));
      
      expect(state.currentPath).toBe('/products');
      expect(state.previousPath).toBe('/home');
      expect(state.navigationHistory).toEqual(['/products', '/home']);
      expect(state.lastTransitionTime).not.toBeNull();
    });

    it('should handle navigating to the same path', () => {
      // First navigation
      let state = navigationReducer(initialState, navigateTo('/home'));
      const transitionTime = state.lastTransitionTime;
      
      // Navigate to the same path
      state = navigationReducer(state, navigateTo('/home'));
      
      // Should not change anything
      expect(state.currentPath).toBe('/home');
      expect(state.previousPath).toBe(null);
      expect(state.navigationHistory).toEqual(['/home']);
      expect(state.lastTransitionTime).toBe(transitionTime);
    });

    it('should limit navigation history to a maximum number of entries', () => {
      // Create a state with many navigation entries
      let state = initialState;
      for (let i = 0; i < 15; i++) {
        state = navigationReducer(state, navigateTo(`/path${i}`));
      }
      
      // Should keep only the 10 most recent paths
      expect(state.navigationHistory.length).toBe(10);
      expect(state.navigationHistory[0]).toBe('/path14');
      expect(state.navigationHistory[9]).toBe('/path5');
    });
  });

  describe('selectors', () => {
    it('should select the current path', () => {
      const state = {
        navigation: {
          currentPath: '/products',
          previousPath: '/home',
          navigationHistory: ['/products', '/home'],
          lastTransitionTime: Date.now(),
        },
      };
      
      expect(selectCurrentPath(state)).toBe('/products');
    });

    it('should select the previous path', () => {
      const state = {
        navigation: {
          currentPath: '/products',
          previousPath: '/home',
          navigationHistory: ['/products', '/home'],
          lastTransitionTime: Date.now(),
        },
      };
      
      expect(selectPreviousPath(state)).toBe('/home');
    });

    it('should select the navigation history', () => {
      const history = ['/products', '/home', '/cart'];
      const state = {
        navigation: {
          currentPath: '/products',
          previousPath: '/home',
          navigationHistory: history,
          lastTransitionTime: Date.now(),
        },
      };
      
      expect(selectNavigationHistory(state)).toBe(history);
    });
  });
});
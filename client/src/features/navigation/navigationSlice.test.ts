import { describe, it, expect } from 'vitest';
import reducer, { 
  navigateTo, 
  clearHistory, 
  selectCurrentPath,
  selectPreviousPath,
  selectNavigationHistory,
  selectLastTransitionTime
} from './navigationSlice';

describe('navigation slice', () => {
  const initialState = {
    previousPath: null,
    currentPath: null,
    navigationHistory: [],
    lastTransitionTime: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle navigateTo action', () => {
    const path = '/products';
    const nextState = reducer(initialState, navigateTo(path));
    
    expect(nextState.currentPath).toEqual(path);
    expect(nextState.previousPath).toEqual(null);
    expect(nextState.navigationHistory).toEqual([path]);
    expect(nextState.lastTransitionTime).toBeDefined();
  });

  it('should handle sequential navigation', () => {
    const firstPath = '/products';
    const secondPath = '/cart';
    
    // First navigation
    let state = reducer(initialState, navigateTo(firstPath));
    
    // Second navigation
    state = reducer(state, navigateTo(secondPath));
    
    expect(state.currentPath).toEqual(secondPath);
    expect(state.previousPath).toEqual(firstPath);
    expect(state.navigationHistory).toEqual([secondPath, firstPath]);
  });

  it('should limit navigation history to 10 items', () => {
    // Create initial state with 10 history items
    const historyItems = Array.from({ length: 10 }, (_, i) => `/path${i}`);
    const stateWithHistory = {
      ...initialState,
      navigationHistory: historyItems,
      currentPath: historyItems[0],
    };
    
    // Add one more path
    const newPath = '/new-path';
    const nextState = reducer(stateWithHistory, navigateTo(newPath));
    
    // History should still be 10 items, with new path at the beginning
    expect(nextState.navigationHistory.length).toEqual(10);
    expect(nextState.navigationHistory[0]).toEqual(newPath);
    expect(nextState.navigationHistory[9]).toEqual('/path8'); // Last item should be dropped
  });

  it('should handle clearHistory action', () => {
    const stateWithHistory = {
      ...initialState,
      navigationHistory: ['/path1', '/path2'],
      currentPath: '/path1',
      previousPath: '/path2',
    };
    
    const nextState = reducer(stateWithHistory, clearHistory());
    
    expect(nextState.navigationHistory).toEqual([]);
    expect(nextState.currentPath).toEqual('/path1'); // Current path should remain
    expect(nextState.previousPath).toEqual('/path2'); // Previous path should remain
  });

  // Test selectors
  it('should select current path', () => {
    const state = {
      navigation: {
        currentPath: '/test',
        previousPath: '/prev',
        navigationHistory: ['/test', '/prev'],
        lastTransitionTime: 12345,
      }
    };
    
    expect(selectCurrentPath(state)).toEqual('/test');
  });
  
  it('should select previous path', () => {
    const state = {
      navigation: {
        currentPath: '/test',
        previousPath: '/prev',
        navigationHistory: ['/test', '/prev'],
        lastTransitionTime: 12345,
      }
    };
    
    expect(selectPreviousPath(state)).toEqual('/prev');
  });
  
  it('should select navigation history', () => {
    const state = {
      navigation: {
        currentPath: '/test',
        previousPath: '/prev',
        navigationHistory: ['/test', '/prev'],
        lastTransitionTime: 12345,
      }
    };
    
    expect(selectNavigationHistory(state)).toEqual(['/test', '/prev']);
  });
  
  it('should select last transition time', () => {
    const state = {
      navigation: {
        currentPath: '/test',
        previousPath: '/prev',
        navigationHistory: ['/test', '/prev'],
        lastTransitionTime: 12345,
      }
    };
    
    expect(selectLastTransitionTime(state)).toEqual(12345);
  });
});
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useState, useEffect } from 'react';
import { AsyncThunkAction } from '@reduxjs/toolkit';

// Enhanced version of useAppDispatch that properly handles AsyncThunkAction types
// This fixes "AsyncThunkAction not assignable to parameter of type UnknownAction" errors
export const useAppDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Return a wrapped version of dispatch that can handle AsyncThunkAction
  return (action: Parameters<AppDispatch>[0] | AsyncThunkAction<any, any, any>) => {
    return dispatch(action as any);
  };
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  
  const toggle = () => setState(prevState => !prevState);
  
  return [state, toggle] as const;
};

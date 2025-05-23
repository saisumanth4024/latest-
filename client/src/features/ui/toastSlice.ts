import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { RootState } from '@/app/store';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action: PayloadAction<Toast>) => {
        state.toasts.push(action.payload);
      },
      prepare: (toast: Omit<Toast, 'id'>) => ({
        payload: {
          id: nanoid(),
          title: toast.title,
          description: toast.description,
          variant: toast.variant || 'default',
          duration: toast.duration || 5000,
        },
      }),
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;

export const selectToasts = (state: RootState) => state.toast.toasts;

export default toastSlice.reducer;
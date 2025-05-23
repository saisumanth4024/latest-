import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

export type ModalType = 
  | 'confirm' 
  | 'alert' 
  | 'form' 
  | 'product-detail' 
  | 'cart' 
  | 'settings' 
  | 'custom';

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  title?: string;
  message?: string;
  data?: any;
  onConfirm?: string; // Action identifier to dispatch on confirm
  onCancel?: string; // Action identifier to dispatch on cancel
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  title: undefined,
  message: undefined,
  data: undefined,
  onConfirm: undefined,
  onCancel: undefined,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Omit<ModalState, 'isOpen'>>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    // Specialized actions for common modal types
    openConfirmModal: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        onConfirm?: string;
        onCancel?: string;
      }>
    ) => {
      state.isOpen = true;
      state.type = 'confirm';
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    openAlertModal: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
      }>
    ) => {
      state.isOpen = true;
      state.type = 'alert';
      state.title = action.payload.title;
      state.message = action.payload.message;
    },
  },
});

export const { openModal, closeModal, openConfirmModal, openAlertModal } = modalSlice.actions;

export const selectModalState = (state: RootState) => state.modal;
export const selectIsModalOpen = (state: RootState) => state.modal.isOpen;

export default modalSlice.reducer;
import { useAppDispatch } from '@/app/hooks';
import { 
  openModal, 
  closeModal, 
  openConfirmModal, 
  openAlertModal,
  ModalType
} from '@/features/ui/modalSlice';

interface UseModalReturn {
  open: (props: {
    type: ModalType;
    title?: string;
    message?: string;
    data?: any;
    onConfirm?: string;
    onCancel?: string;
  }) => void;
  close: () => void;
  confirm: (props: {
    title: string;
    message: string;
    onConfirm?: string;
    onCancel?: string;
  }) => void;
  alert: (props: {
    title: string;
    message: string;
  }) => void;
}

export const useModal = (): UseModalReturn => {
  const dispatch = useAppDispatch();

  return {
    open: (props) => dispatch(openModal(props)),
    close: () => dispatch(closeModal()),
    confirm: (props) => dispatch(openConfirmModal(props)),
    alert: (props) => dispatch(openAlertModal(props)),
  };
};

export default useModal;
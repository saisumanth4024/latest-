import { useAppDispatch } from '@/app/hooks';
import { addToast, removeToast, clearToasts, Toast, ToastVariant } from '@/features/ui/toastSlice';

interface UseToastReturn {
  toast: (props: Omit<Toast, 'id'>) => void;
  success: (props: Omit<Toast, 'id' | 'variant'>) => void;
  error: (props: Omit<Toast, 'id' | 'variant'>) => void;
  warning: (props: Omit<Toast, 'id' | 'variant'>) => void;
  info: (props: Omit<Toast, 'id' | 'variant'>) => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const dispatch = useAppDispatch();

  const toast = (props: Omit<Toast, 'id'>) => {
    dispatch(addToast(props));
  };

  const createVariantToast = (variant: ToastVariant) => {
    return (props: Omit<Toast, 'id' | 'variant'>) => {
      dispatch(addToast({ ...props, variant }));
    };
  };

  return {
    toast,
    success: createVariantToast('success'),
    error: createVariantToast('destructive'),
    warning: createVariantToast('warning'),
    info: createVariantToast('info'),
    remove: (id: string) => dispatch(removeToast(id)),
    clearAll: () => dispatch(clearToasts()),
  };
};

export default useToast;
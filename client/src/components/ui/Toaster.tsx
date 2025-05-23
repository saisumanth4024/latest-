import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectToasts, removeToast, Toast } from '@/features/ui/toastSlice';
import { AnimatePresence, motion } from 'framer-motion';

interface ToasterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const toastPositions = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

const variantStyles = {
  default: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100',
  destructive: 'bg-red-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-blue-600 text-white',
};

export function Toaster({ position = 'top-right' }: ToasterProps) {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 w-full max-w-sm ${toastPositions[position]}`}
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id}
            toast={toast}
            onClose={() => dispatch(removeToast(toast.id))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { id, title, description, variant = 'default', duration = 5000 } = toast;
  
  // Auto dismiss
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${variantStyles[variant]} rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden pointer-events-auto flex`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-1 w-0 p-4">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="mt-1 text-sm opacity-90">{description}</div>}
      </div>
      <div className="flex border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg flex items-center justify-center text-sm font-medium p-4 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default Toaster;
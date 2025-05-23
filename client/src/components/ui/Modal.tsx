import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectModalState, closeModal } from '@/features/ui/modalSlice';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  onClose?: () => void;
}

export function Modal({ onClose }: ModalProps = {}) {
  const modalState = useAppSelector(selectModalState);
  const dispatch = useAppDispatch();
  const { isOpen, type, title, message, data } = modalState;
  
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const handleClose = () => {
    if (onClose) onClose();
    dispatch(closeModal());
  };
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };
  
  // Modal Content Based on Type
  const renderModalContent = () => {
    switch (type) {
      case 'alert':
        return (
          <AlertModal 
            title={title || 'Alert'}
            message={message || ''}
            onClose={handleClose}
          />
        );
      case 'confirm':
        return (
          <ConfirmModal 
            title={title || 'Confirm'}
            message={message || ''}
            onConfirm={() => {
              // Here you would handle the confirmed action
              // Can be extended to dispatch a stored action identifier
              handleClose();
            }}
            onCancel={handleClose}
          />
        );
      case 'form':
        return (
          <FormModal 
            title={title || 'Form'}
            data={data}
            onClose={handleClose}
          />
        );
      case 'product-detail':
      case 'cart':
      case 'settings':
      case 'custom':
      default:
        // For custom modals, the content should be controlled by the parent
        return (
          <div className="p-6">
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
            {message && <p className="mb-4">{message}</p>}
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              ref={overlayRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xl transition-all w-full max-w-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {renderModalContent()}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Alert Modal
function AlertModal({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2" id="modal-title">{title}</h3>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
        >
          OK
        </button>
      </div>
    </div>
  );
}

// Confirm Modal
function ConfirmModal({ 
  title, 
  message, 
  onConfirm, 
  onCancel 
}: { 
  title: string; 
  message: string; 
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2" id="modal-title">{title}</h3>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

// Form Modal - Basic implementation
function FormModal({ 
  title, 
  data, 
  onClose 
}: { 
  title: string; 
  data?: any;
  onClose: () => void;
}) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4" id="modal-title">{title}</h3>
      <div className="mb-4">
        {/* Form fields would go here, typically controlled by the data prop */}
        <p className="text-gray-500 dark:text-gray-400">Form content here</p>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Modal;
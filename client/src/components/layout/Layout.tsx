import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import { useMobileDetect } from '@/app/hooks';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

interface NotificationProps {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
}

const NotificationBar = ({ message, type, onClose }: NotificationProps) => {
  const bgColors = {
    info: 'bg-blue-100 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500',
    success: 'bg-green-100 border-green-500 dark:bg-green-900/20 dark:border-green-500',
    warning: 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-500',
    error: 'bg-red-100 border-red-500 dark:bg-red-900/20 dark:border-red-500'
  };

  const textColors = {
    info: 'text-blue-700 dark:text-blue-300',
    success: 'text-green-700 dark:text-green-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    error: 'text-red-700 dark:text-red-300'
  };

  return (
    <div className={`px-4 py-3 rounded-md border-l-4 mb-6 ${bgColors[type]}`} role="alert">
      <div className="flex items-center justify-between">
        <div className={`font-medium ${textColors[type]}`}>
          {message}
        </div>
        <button 
          type="button" 
          className={`${textColors[type]} inline-flex focus:outline-none`}
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobileDetect();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [location] = useLocation();
  
  // Demo notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    visible: boolean;
  } | null>(null);
  
  // Update sidebar visibility based on screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Demo: Show route change notifications
  useEffect(() => {
    if (location === '/') {
      setNotification({
        message: 'Welcome to the dashboard!',
        type: 'info',
        visible: true
      });
    } else if (location !== '/' && notification?.visible) {
      setNotification({
        message: `You navigated to ${location.substring(1)}`,
        type: 'success',
        visible: true
      });
    }
    
    // Auto-hide notification after 5 seconds
    const timer = setTimeout(() => {
      if (notification?.visible) {
        setNotification(prev => prev ? { ...prev, visible: false } : null);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const closeNotification = () => {
    setNotification(prev => prev ? { ...prev, visible: false } : null);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <main className="p-4 md:p-6 max-w-8xl mx-auto">
            <Breadcrumb />
            
            {/* Notification Banner */}
            {notification?.visible && (
              <NotificationBar 
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
            
            {/* Banner Slot - for future use */}
            <div id="banner-slot"></div>
            
            {children}
          </main>
        </div>
      </div>
      
      {/* Sticky Footer */}
      <footer className="py-3 px-6 text-center bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>© {new Date().getFullYear()} Enterprise Application. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">
            <a href="#privacy" className="hover:text-primary-600 dark:hover:text-primary-400 mx-2">Privacy Policy</a>
            <a href="#terms" className="hover:text-primary-600 dark:hover:text-primary-400 mx-2">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

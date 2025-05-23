import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useMobileDetect } from '@/app/hooks';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobileDetect();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Update sidebar visibility based on screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <main className="p-4 md:p-6 max-w-8xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

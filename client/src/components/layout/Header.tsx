import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/auth/authSlice';
import NotificationMenu from '@/components/ui/NotificationMenu';
import UserMenu from '@/components/ui/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const user = useAppSelector(selectUser);
  
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm py-2 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden mr-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="font-bold text-xl tracking-tight text-primary-800 dark:text-primary-200">Enterprise App</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationMenu />
        {user && <UserMenu user={user} />}
        <ThemeToggle />
      </div>
    </header>
  );
}

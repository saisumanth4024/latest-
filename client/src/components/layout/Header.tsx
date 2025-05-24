import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectUser, selectIsAuthenticated } from '@/features/auth/authSlice';
import NotificationMenu from '@/components/ui/NotificationMenu';
import UserMenu from '@/components/ui/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';
import GlobalSearch from '@/features/search/components/GlobalSearch';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [searchOpen, setSearchOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 shadow-sm py-2 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden mr-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-bold text-xl tracking-tight text-primary-800 dark:text-primary-200">Enterprise App</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-6 space-x-4">
          <Link href="/">
            <div className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Dashboard</div>
          </Link>
          <Link href="/products">
            <div className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Products</div>
          </Link>
          <Link href="/orders">
            <div className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Orders</div>
          </Link>
          <Link href="/search">
            <div className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">Search</div>
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Global Search */}
        <div className="relative hidden sm:block w-72">
          <GlobalSearch />
        </div>
        
        {/* Only show NotificationMenu when authenticated */}
        {isAuthenticated && <NotificationMenu />}
        
        {/* Only show UserMenu when user data is available */}
        {isAuthenticated && user && <UserMenu user={user} />}
        
        <ThemeToggle />
      </div>
    </header>
  );
}

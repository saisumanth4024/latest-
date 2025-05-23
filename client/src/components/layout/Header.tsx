import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { selectUser } from '@/features/auth/authSlice';
import NotificationMenu from '@/components/ui/NotificationMenu';
import UserMenu from '@/components/ui/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const user = useAppSelector(selectUser);
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
        <div className="relative hidden sm:block">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
          
          {searchOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSearchOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg overflow-hidden z-20 border border-slate-200 dark:border-slate-700">
                <div className="p-2">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 pl-8 pr-4 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 text-sm"
                      placeholder="Search..."
                      autoFocus
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 py-2 px-2 text-xs text-slate-500 dark:text-slate-400">
                  Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">ESC</kbd> to close
                </div>
              </div>
            </>
          )}
        </div>
        
        <NotificationMenu />
        {user && <UserMenu user={user} />}
        <ThemeToggle />
      </div>
    </header>
  );
}

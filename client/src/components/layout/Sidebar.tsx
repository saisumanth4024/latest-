import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { routes } from '@/App';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  active?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavItem({ href, active, icon, children }: NavItemProps) {
  return (
    <Link href={href}>
      <div 
        className={cn(
          "flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
          active 
            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" 
            : "text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-700 dark:hover:text-primary-300"
        )}
      >
        {icon}
        <span>{children}</span>
      </div>
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <aside 
      className={cn(
        "lg:block w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300 overflow-y-auto",
        isOpen ? "block fixed inset-y-0 z-50 lg:relative" : "hidden"
      )}
    >
      <div className="p-4">
        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <input 
              type="text" 
              className="pl-10 w-full py-2 pr-3 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 text-sm" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">Main</span>
            <NavItem 
              href="/" 
              active={location === "/"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              }
            >
              Dashboard
            </NavItem>
            <NavItem 
              href="/products" 
              active={location === "/products"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              }
            >
              Products
            </NavItem>
            <NavItem 
              href="/orders" 
              active={location === "/orders"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              }
            >
              Orders
            </NavItem>
            <NavItem 
              href="/search" 
              active={location === "/search"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            >
              Search
            </NavItem>
            <NavItem 
              href="/analytics" 
              active={location === "/analytics"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Analytics
            </NavItem>
          </div>
          
          <div className="mt-8 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">Account</span>
            <NavItem 
              href="/profile" 
              active={location === "/profile"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              }
            >
              Profile
            </NavItem>
            <NavItem 
              href="/settings" 
              active={location === "/settings"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              }
            >
              Settings
            </NavItem>
            <NavItem 
              href="/admin" 
              active={location === "/admin"} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-1.723-1.262A6 6 0 1118 8zm-6-4a1 1 0 102 0 1 1 0 00-2 0zM5 12a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" />
                </svg>
              }
            >
              Admin
            </NavItem>
          </div>
        </nav>
      </div>
    </aside>
  );
}

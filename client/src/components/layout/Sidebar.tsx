import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectUserRole, setAuthState, logout } from '@/features/auth/authSlice';
import { cn } from '@/lib/utils';
import { getNavigationByRole, type UserRole, type NavItem as NavItemType, type NavSection } from '@/config/navigation';
import { NavIcon } from '@/components/icons/NavIcons';
// Using UserRole from navigation config for consistency

interface NavItemProps {
  href: string;
  active?: boolean;
  icon: string;
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
        <NavIcon name={icon} />
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
  const userRole = useAppSelector(selectUserRole);
  const dispatch = useAppDispatch();
  
  // Get navigation items filtered by user role
  const navSections = getNavigationByRole(userRole);

  // Demo role selector - in a real app, this would be based on user permissions/login
  // For demo purposes, we'll use localStorage to simulate role changes
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value as UserRole;
    
    // Use Redux action creator to update the auth state with the selected role
    dispatch(setAuthState(selectedRole));
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
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

        {/* Role Selector (Demo) */}
        <div className="mb-6">
          <label htmlFor="role-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Switch Role (Demo)
          </label>
          <select
            id="role-select"
            value={userRole}
            onChange={handleRoleChange}
            className="w-full py-2 px-3 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 text-sm"
          >
            <option value="guest">Guest</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <nav className="space-y-8">
          {navSections.map((section: NavSection, sectionIndex: number) => (
            <div key={sectionIndex} className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
                {section.title}
              </span>
              
              {section.items.map((item: NavItemType, itemIndex: number) => (
                <NavItem
                  key={itemIndex}
                  href={item.path}
                  active={location === item.path}
                  icon={item.icon}
                >
                  {item.title}
                </NavItem>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

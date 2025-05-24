import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { cn } from '@/lib/utils';
import { User } from '@/features/auth/types';
import { UserRole } from '@/config/navigation';
import { Link } from 'wouter';

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  const toggleMenu = () => setIsOpen(prev => !prev);
  
  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };
  
  const closeMenu = () => setIsOpen(false);
  
  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
          {user.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt={user.firstName || 'User'} 
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            (user.firstName?.[0] || '') + (user.lastName?.[0] || '')
          )}
        </div>
        <span className="hidden md:inline-block">{user.firstName || user.email || 'User'}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeMenu}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-lg rounded-md overflow-hidden z-20 border border-slate-200 dark:border-slate-700">
            <ul>
              <li>
                <Link href="/profile">
                  <div 
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Profile
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <div
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Settings
                  </div>
                </Link>
              </li>
              {/* Admin link - only visible to admins */}
              {(['admin'].includes(user.role as string)) && (
                <li>
                  <Link href="/admin/dashboard">
                    <div
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Admin Dashboard
                    </div>
                  </Link>
                </li>
              )}
              
              {/* Seller link - only visible to sellers and admins */}
              {(['seller', 'admin'].includes(user.role as string)) && (
                <li>
                  <Link href="/seller/dashboard">
                    <div
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Seller Dashboard
                    </div>
                  </Link>
                </li>
              )}
              
              {/* Moderator link - only visible to moderators and admins */}
              {(['moderator', 'admin'].includes(user.role as string)) && (
                <li>
                  <Link href="/moderation/reviews">
                    <div
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Content Moderation
                    </div>
                  </Link>
                </li>
              )}
              <li className="border-t border-slate-200 dark:border-slate-700">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

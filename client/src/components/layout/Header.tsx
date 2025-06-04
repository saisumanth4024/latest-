import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/app/hooks';
import LogoutButton from '@/features/auth/components/LogoutButton';
import NotificationMenu from '@/components/ui/NotificationMenu';
import UserMenu from '@/components/ui/UserMenu';
import ThemeToggle from '@/components/ui/ThemeToggle';
import GlobalSearch from '@/features/search/components/GlobalSearch';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Get cart items count from Redux store
  const cartItemsCount = useAppSelector((state) => state.cart.cart?.items?.length || 0);
  
  // Get wishlist items count from Redux store
  const wishlistItemsCount = useAppSelector((state) => state.wishlist.wishlists.reduce((count, list) => count + list.items.length, 0));
  
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary-600 to-blue-700 px-4 py-2 text-white shadow-sm backdrop-blur-md"
    >
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
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="font-bold text-xl tracking-tight text-white">ShopEase</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-6 space-x-4">
          <Link href="/">
            <div className="cursor-pointer rounded px-3 py-2 text-sm font-medium text-white hover:bg-white/10">Dashboard</div>
          </Link>
          <Link href="/products">
            <div className="cursor-pointer rounded px-3 py-2 text-sm font-medium text-white hover:bg-white/10">Products</div>
          </Link>
          <Link href="/orders">
            <div className="cursor-pointer rounded px-3 py-2 text-sm font-medium text-white hover:bg-white/10">Orders</div>
          </Link>
          <Link href="/search">
            <div className="cursor-pointer rounded px-3 py-2 text-sm font-medium text-white hover:bg-white/10">Search</div>
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Global Search */}
        <div className="relative hidden sm:block w-96">
          <GlobalSearch />
        </div>
        
        {/* Wishlist Icon */}
        <Link href="/wishlists">
          <div className="relative cursor-pointer rounded-full p-2 hover:bg-white/10">
            <Heart className="h-5 w-5 text-white" />
            {wishlistItemsCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
              </Badge>
            )}
          </div>
        </Link>
        
        {/* Cart Icon */}
        <Link href="/cart">
          <div className="relative cursor-pointer rounded-full p-2 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5 text-white" />
            {cartItemsCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </Badge>
            )}
          </div>
        </Link>
        
        {/* Only show NotificationMenu when authenticated */}
        {isAuthenticated && <NotificationMenu />}
        
        {/* Only show UserMenu when user data is available */}
        {isAuthenticated && user && <UserMenu user={user} />}
        
        {/* Custom Logout Button */}
        {isAuthenticated && (
          <div className="hidden md:block">
            <LogoutButton
              variant="outline"
              className="border-white bg-white/20 px-4 py-2 text-white hover:bg-white/30"
            />
          </div>
        )}
        
        {/* If not authenticated, show login button */}
        {!isAuthenticated && (
          <Link href="/login">
            <div className="cursor-pointer rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-primary-700 shadow hover:bg-white">
              Log In
            </div>
          </Link>
        )}
        
        <ThemeToggle />
      </div>
    </header>
  );
}

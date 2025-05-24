import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  ChevronDown,
  LogOut,
  Home,
  BarChart3,
  Package,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { selectCartItemsCount } from '@/features/cart/cartSlice';
import { selectWishlistItemsCount } from '@/features/wishlist/wishlistSlice';
import { selectUserProfile } from '@/features/profile/profileSlice';
import { UserRole } from '@/config/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

export interface HeaderProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onThemeToggle, isDarkMode }) => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = useSelector(selectCartItemsCount);
  const wishlistItemsCount = useSelector(selectWishlistItemsCount);
  const userProfile = useSelector(selectUserProfile);

  const isLoggedIn = !!userProfile;
  const userRole = userProfile?.role || 'guest';
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Searching for:', searchQuery);
    // Navigate to search results page
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const userMenuItems = [
    {
      label: 'Dashboard',
      icon: <Home className="mr-2 h-4 w-4" />,
      path: '/',
      roles: ['user', 'admin', 'seller'],
    },
    {
      label: 'Orders',
      icon: <Package className="mr-2 h-4 w-4" />,
      path: '/orders',
      roles: ['user', 'admin', 'seller'],
    },
    {
      label: 'Analytics',
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      path: '/analytics',
      roles: ['admin', 'seller'],
    },
    {
      label: 'Settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
      path: '/settings',
      roles: ['user', 'admin', 'seller'],
    },
  ];
  
  // Only show menu items for the user's role
  const filteredUserMenuItems = userMenuItems.filter(item => 
    item.roles.includes(userRole as UserRole)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link to="/">
            <a className="hidden md:flex space-x-2 items-center">
              <span className="font-bold text-xl">eShop</span>
            </a>
          </Link>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/">
                  <a className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    <Home className="h-5 w-5" />
                    Home
                  </a>
                </Link>
                <Link href="/products">
                  <a className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    <Package className="h-5 w-5" />
                    Products
                  </a>
                </Link>
                {isLoggedIn && (
                  <>
                    <Link href="/orders">
                      <a className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                        <Package className="h-5 w-5" />
                        Orders
                      </a>
                    </Link>
                    {(userRole === 'admin' || userRole === 'seller') && (
                      <Link href="/analytics">
                        <a className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                          <BarChart3 className="h-5 w-5" />
                          Analytics
                        </a>
                      </Link>
                    )}
                    <Link href="/settings">
                      <a className="flex items-center gap-2 text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="h-5 w-5" />
                        Settings
                      </a>
                    </Link>
                  </>
                )}
                <div className="border-t pt-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={onThemeToggle}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
                {isLoggedIn ? (
                  <div className="border-t pt-4 mt-4">
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Handle logout
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => {
                        // Navigate to login
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Navigate to signup
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/products">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Products
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/featured"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Featured Collections
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover our latest collections and bestsellers
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/category/electronics">
                        <NavigationMenuLink>Electronics</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/category/clothing">
                        <NavigationMenuLink>Clothing</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/category/home">
                        <NavigationMenuLink>Home & Garden</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/category/beauty">
                        <NavigationMenuLink>Beauty & Health</NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/categories">
                        <NavigationMenuLink>All Categories</NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/deals">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Deals
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {(userRole === 'admin' || userRole === 'seller') && (
                <NavigationMenuItem>
                  <Link href="/analytics">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Analytics
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden md:flex ml-auto md:gap-2 lg:gap-4">
          <form onSubmit={handleSearch} className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center ml-auto md:ml-0">
          <Button variant="ghost" size="icon" className="mr-2" onClick={onThemeToggle}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <NotificationBell />
          
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemsCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] leading-none py-0 px-1"
                >
                  {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center text-[10px] leading-none py-0 px-1"
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.profileImageUrl} alt={userProfile?.username} />
                    <AvatarFallback>{getInitials(userProfile?.username || '')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filteredUserMenuItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <DropdownMenuItem>
                      {item.icon}
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="ml-2">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="container flex md:hidden py-2">
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </header>
  );
};
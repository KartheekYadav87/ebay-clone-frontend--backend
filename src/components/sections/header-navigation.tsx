'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown, Bell, ShoppingCart, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const EbayLogo = () => (
  <Link href="/" className="shrink-0" aria-label="eBay Home">
    <svg width="117" height="48" viewBox="0 0 117 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.69 16.48H30.42V17.85H11.69V16.48Z" fill="#E53238" />
      <path
        d="M10.15 28.32L11.49 23.46H7.59L6.25 28.32H10.15ZM16.2 30.65H1.47L7.37 9.74H11.52L9.62 16.54H15.75L11.3 30.65Z"
        fill="#0064D2"
      />
      <path d="M43.79 16.48H62.52V17.85H43.79V16.48Z" fill="#E53238" />
      <path
        d="M42.25 28.32L43.59 23.46H39.69L38.35 28.32H42.25ZM48.3 30.65H33.57L39.47 9.74H43.62L41.72 16.54H47.85L43.4 30.65Z"
        fill="#0064D2"
      />
      <path
        d="M96.16 18.25C99.5 18.25 101.78 20.2 101.78 23.08C101.78 26.03 99.76 27.98 96.06 27.98H90.96V34.62H87.06V13.72H96.16ZM90.96 26.64H95.26C97.51 26.64 98.65 25.35 98.65 23.08C98.65 20.81 97.51 19.57 95.26 19.57H90.96V26.64Z"
        fill="#F5AF02"
      />
      <path d="M75.89 16.48H94.62V17.85H75.89V16.48Z" fill="#E53238" />
      <path
        d="M74.35 28.32L75.69 23.46H71.79L70.45 28.32H74.35ZM80.4 30.65H65.67L71.57 9.74H75.72L73.82 16.54H79.95L75.5 30.65Z"
        fill="#0064D2"
      />
      <path
        d="M110.13 22.95C110.47 22.81 110.78 22.7 111.06 22.63C111.54 22.52 111.89 22.4 112.1 22.26C112.31 22.12 112.42 21.91 112.42 21.63S112.32 21.13 112.11 20.94C111.91 20.76 111.64 20.67 111.32 20.67C111.01 20.67 110.74 20.74 110.5 20.9C110.27 21.05 110.07 21.24 109.92 21.47L108.61 20.25C108.91 19.86 109.3 19.52 109.74 19.23C110.19 18.94 110.71 18.8 111.31 18.8C112.13 18.8 112.81 18.99 113.36 19.38S114.18 20.33 114.18 21.08V21.37C114.18 21.77 114.11 22.13 113.95 22.44C113.8 22.75 113.57 23.02 113.27 23.25C112.97 23.48 112.58 23.68 112.12 23.83C111.65 23.99 111.22 24.11 110.83 24.22C110.33 24.33 109.97 24.45 109.74 24.59S109.4 24.94 109.4 25.22S109.51 25.7 109.74 25.88C109.97 26.06 110.26 26.15 110.61 26.15C110.97 26.15 111.29 26.07 111.59 25.9C111.89 25.73 112.15 25.5 112.36 25.21L113.67 26.46C113.4 26.88 113.03 27.24 112.58 27.53C112.13 27.82 111.56 27.97 110.89 27.97C110.06 27.97 109.38 27.77 108.83 27.37S108.01 26.4 108.01 25.63V25.42C108.01 24.98 108.09 24.59 108.24 24.24C108.39 23.89 108.62 23.59 108.92 23.34C109.22 23.09 109.6 22.88 110.13 22.68V22.95Z"
        fill="#86B817"
      />
    </svg>
  </Link>
);

const myEbayItems = [
  { name: 'Summary', href: '#' },
  { name: 'Recently Viewed', href: '#' },
  { name: 'Bids/Offers', href: '#' },
  { name: 'Watchlist', href: '#' },
  { name: 'Purchase History', href: '#' },
  { name: 'Buy Again', href: '#' },
  { name: 'Selling', href: '#' },
  { name: 'Saved Searches', href: '#' },
  { name: 'Messages', href: '#' },
];

const categories = [
  'Electronics',
  'Home',
  'Fashion',
  'Sports',
  'Books',
  'Tools',
];

export default function HeaderNavigation() {
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart?buyerId=1');
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <header className="bg-white border-b border-zinc-200 font-sans">
      <div className="w-full mx-auto px-4">
        {/* Top navigation */}
        <nav className="flex justify-between items-center h-[31px] text-[12px] text-zinc-500">
          <div className="flex items-center gap-x-4">
            <span className="hidden lg:inline">
              Hi!{' '}
              <a href="#" className="text-primary hover:underline">
                Sign in
              </a>{' '}
              or{' '}
              <a href="#" className="text-primary hover:underline">
                register
              </a>
            </span>
            <a href="#" className="hover:text-primary hover:underline">
              Daily Deals
            </a>
            <a href="#" className="hover:text-primary hover:underline">
              Brand Outlet
            </a>
            <a href="#" className="hover:text-primary hover:underline">
              Gift Cards
            </a>
            <a href="#" className="hover:text-primary hover:underline">
              Help & Contact
            </a>
          </div>
          <div className="flex items-center gap-x-4">
            <a href="#" className="hover:text-primary hover:underline">
              Sell
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center hover:text-primary gap-x-1">
                  Watchlist <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-4 text-sm">Please <a href="#" className="text-primary hover:underline">sign in</a> to view your watchlist.</div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center hover:text-primary gap-x-1">
                  My eBay <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {myEbayItems.map((item) => (
                  <DropdownMenuItem key={item.name}>
                    <a href={item.href}>{item.name}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button aria-label="Notifications" className="hover:text-primary">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/cart" aria-label="Your shopping cart" className="hover:text-primary relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-alert-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Main Header */}
        <div className="flex items-center gap-x-2.5 h-[60px]">
          <EbayLogo />
          
          <div className="hidden lg:block ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-x-2 text-sm text-[#191919] p-2 hover:bg-zinc-100 hover:text-primary"
                >
                  Shop by category
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link href={`/category/${encodeURIComponent(category)}`} className="cursor-pointer">
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        
          <div className="flex-grow flex items-center gap-x-1 mx-5">
            <form className="w-full flex items-center">
              <div className="flex-grow flex items-center border border-zinc-700 rounded-full h-12 overflow-hidden">
                <div className="relative flex-grow h-full flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Search for anything"
                    className="w-full h-full pl-11 pr-4 bg-transparent border-none focus:ring-0 text-base"
                  />
                </div>
                <div className="w-px h-6 bg-zinc-300"></div>
                <select className="bg-transparent border-none focus:ring-0 text-sm text-zinc-500 px-4 cursor-pointer outline-none">
                  <option>All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="h-12 w-[120px] rounded-full text-base font-bold bg-primary hover:bg-primary/90 ml-[-2px]">
                Search
              </Button>
            </form>
          </div>
          <a href="#" className="hidden xl:block text-sm text-zinc-700 hover:underline shrink-0">Advanced</a>
        </div>
      </div>
      
      {/* Secondary Navigation */}
      <nav className="h-[43px] border-t border-zinc-200">
        <div className="w-full mx-auto px-4 h-full flex items-center justify-center gap-x-6 text-sm text-zinc-800">
          {categories.map((category) => (
            <Link key={category} href={`/category/${encodeURIComponent(category)}`} className="hover:text-primary">
              {category}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CartIcon } from '@/components/ui/Cart';
import UserMenu from '@/components/auth/UserMenu';
import SearchBar from '@/components/search/SearchBar';
import { useWishlist } from '@/contexts/WishlistContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getWishlistCount } = useWishlist();

  const handleWishlistClick = () => {
    router.push('/wishlist');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-amber-700 font-brand">
              Handcrafted Haven
            </span>
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center space-x-6 flex-1 max-w-xl mx-8">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-amber-700 transition-colors font-medium whitespace-nowrap">
                Home
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-amber-700 transition-colors font-medium whitespace-nowrap">
                Shop
              </Link>
              <Link href="/artisans" className="text-gray-700 hover:text-amber-700 transition-colors font-medium whitespace-nowrap">
                Artisans
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-amber-700 transition-colors font-medium whitespace-nowrap">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-700 transition-colors font-medium whitespace-nowrap">
                Contact
              </Link>
            </nav>
            
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <SearchBar />
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleWishlistClick}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-700 transition-colors cursor-pointer relative"
              aria-label="View wishlist"
            >
              <i className="ri-heart-line text-xl"></i>
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </button>
            <CartIcon />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar />
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                Home
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                Shop
              </Link>
              <Link href="/artisans" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                Artisans
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                Contact
              </Link>
              <Link href="/wishlist" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                Wishlist ({getWishlistCount()})
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-amber-700 transition-colors font-medium">
                Shopping Cart (0)
              </Link>
              <div className="pt-2">
                <UserMenu />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

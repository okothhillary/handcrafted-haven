'use client';

import React from 'react';
import { useWishlistActions } from '@/contexts/WishlistContext';

interface WishlistIconProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    artisan: string;
    rating: number;
    category: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistIcon({ product, className = '', size = 'md' }: WishlistIconProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistActions();
  const inWishlist = isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        bg-white rounded-full shadow-md 
        hover:bg-gray-50 transition-colors 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`${
        inWishlist ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-gray-600'
      }`}></i>
    </button>
  );
}

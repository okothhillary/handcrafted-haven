'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { useWishlistActions } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
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
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ 
  product, 
  className = '', 
  variant = 'secondary',
  size = 'md'
}: WishlistButtonProps) {
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

  return (
    <Button
      onClick={handleToggle}
      variant={variant}
      size={size}
      className={`${className} ${inWishlist ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : ''}`}
    >
      <i className={`${
        inWishlist ? 'ri-heart-fill' : 'ri-heart-line'
      } mr-2`}></i>
      {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </Button>
  );
}

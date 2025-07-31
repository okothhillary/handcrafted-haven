'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useWishlist, useWishlistActions } from '@/contexts/WishlistContext';
import { useCartActions } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { state } = useWishlist();
  const { removeFromWishlist, clearWishlist } = useWishlistActions();
  const { addItem } = useCartActions();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Wishlist', isCurrentPage: true }
  ];

  const handleMoveToCart = (item: typeof state.items[0]) => {
    // Add to cart
    addItem({
      id: parseInt(item.product.id),
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      artisan: item.product.artisan,
      materials: [], // Default empty materials
    });
    
    // Remove from wishlist
    removeFromWishlist(item.productId);
  };

  if (state.items.length === 0) {
    return (
      <PageLayout 
        title="My Wishlist"
        breadcrumbs={breadcrumbs}
        showBreadcrumbs={true}
      >
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <i className="ri-heart-line text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="My Wishlist"
      breadcrumbs={breadcrumbs}
      showBreadcrumbs={true}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {state.items.length} {state.items.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
          {state.items.length > 0 && (
            <Button 
              variant="ghost" 
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <div className="relative">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <i className="ri-heart-fill text-red-500"></i>
                </button>
              </div>
              
              <div className="p-4">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors mb-2">
                    {item.product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-600 mb-2">by {item.product.artisan}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i 
                        key={i} 
                        className={`ri-star-${i < Math.floor(item.product.rating) ? 'fill' : 'line'} text-sm`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({item.product.rating})</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.product.price}
                    </span>
                    {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    Added {item.addedAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleMoveToCart(item)}
                    variant="primary"
                    className="w-full"
                    size="sm"
                  >
                    Move to Cart
                  </Button>
                  <Link href={`/products/${item.product.id}`}>
                    <Button variant="ghost" className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              You might also like
            </h3>
            <p className="text-gray-600 mb-6">
              Discover more handcrafted items based on your interests
            </p>
            <Link href="/products">
              <Button variant="secondary">
                Browse More Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useCartActions } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter();
  const { state } = useCart();
  const { updateQuantity, removeItem, clearCart } = useCartActions();
  const { state: authState } = useAuth();

  const handleCheckout = () => {
    // TODO: Add authentication check when user management is implemented
    // Allow guest checkout for now
    onClose();
    router.push('/checkout');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart">
      <div className="max-w-2xl mx-auto">
        {state.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shopping-cart-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some amazing handcrafted items to get started!</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {state.items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">by {item.artisan}</p>
                      <div className="flex gap-1 mt-1">
                        {item.materials.slice(0, 2).map((material, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                      >
                        <i className="ri-subtract-line text-sm"></i>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                      >
                        <i className="ri-add-line text-sm"></i>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <Card className="p-6 bg-gray-50">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items ({state.itemCount})</span>
                  <span className="font-semibold">${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button variant="secondary" onClick={onClose} className="flex-1">
                Continue Shopping
              </Button>
              <Button onClick={handleCheckout} className="flex-1">
                Checkout
              </Button>
            </div>

            {state.items.length > 0 && (
              <div className="text-center mt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

export function CartIcon() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state } = useCart();

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-700 transition-colors cursor-pointer relative"
        aria-label="View shopping cart"
      >
        <i className="ri-shopping-cart-line text-xl"></i>
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </span>
        )}
      </button>
      
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

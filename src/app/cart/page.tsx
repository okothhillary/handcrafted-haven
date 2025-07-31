'use client';

import { useCart, useCartActions } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function CartPage() {
  const router = useRouter();
  const { state } = useCart();
  const { updateQuantity, removeItem, clearCart } = useCartActions();
  const { state: authState } = useAuth();

  const handleCheckout = () => {
    // TODO: Add authentication check when user management is implemented
    // For now, allow guest checkout
    router.push('/checkout');
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shopping-cart-line text-5xl text-gray-400"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">Discover amazing handcrafted items to fill your cart!</p>
            <Link href="/shop">
              <Button size="lg" className="px-8">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{state.items.length} item{state.items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-700 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">by {item.artisan}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <i className="ri-subtract-line text-sm"></i>
                      </button>
                      <span className="text-lg font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <i className="ri-add-line text-sm"></i>
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(state.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-amber-700">
                      ${(state.total * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                <Link href="/shop">
                  <Button
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <i className="ri-shield-check-line mr-2"></i>
                  Secure checkout guaranteed
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

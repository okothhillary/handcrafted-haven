'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useCartActions } from '@/contexts/CartContext';
import { useOrderActions } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ShippingAddress } from '@/contexts/OrderContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cartState } = useCart();
  const { clearCart } = useCartActions();
  const { createOrder } = useOrderActions();
  const { state: authState } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: authState.user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartState.items.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const orderItems = cartState.items.map(item => ({
        productId: item.id,
        name: item.name,
        artisan: item.artisan || 'Unknown Artisan',
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        materials: item.materials || []
      }));

      const order = await createOrder({
        items: orderItems,
        shippingAddress: formData
      });

      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-shopping-cart-line text-6xl text-gray-400 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
          <Button onClick={() => router.push('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </form>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              
              {/* Payment Methods */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="credit-card"
                    name="payment-method"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="credit-card" className="flex items-center space-x-2 cursor-pointer">
                    <i className="ri-bank-card-line text-xl text-gray-600"></i>
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment-method"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                    <i className="ri-paypal-line text-xl text-blue-600"></i>
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'credit-card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <i className="ri-paypal-line text-6xl text-blue-600 mb-4"></i>
                  <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-shield-check-line text-green-600 mr-2"></i>
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  form="checkout-form"
                  variant="primary"
                  disabled={isPlacingOrder}
                  className="w-full"
                  size="lg"
                >
                  {isPlacingOrder ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <i className="ri-secure-payment-line mr-2"></i>
                      Complete Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">by {item.artisan}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free shipping message */}
              {subtotal > 100 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    You qualify for free shipping!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

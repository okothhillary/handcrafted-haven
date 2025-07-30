'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/contexts/OrderContext';
import { Order } from '@/contexts/OrderContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = params?.id as string;
    if (orderId && state.orders.length > 0) {
      const foundOrder = state.orders.find(o => o.id === orderId);
      setOrder(foundOrder || null);
    }
    setLoading(false);
  }, [params?.id, state.orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-amber-600 mb-4"></i>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-file-search-line text-6xl text-gray-400 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/account/orders')}>
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'ri-time-line';
      case 'shipped':
        return 'ri-truck-line';
      case 'delivered':
        return 'ri-check-line';
      case 'cancelled':
        return 'ri-close-line';
      default:
        return 'ri-information-line';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message for New Orders */}
        {new Date().getTime() - new Date(order.date).getTime() < 60000 && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <i className="ri-check-double-line text-2xl text-green-600 mr-3"></i>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Order Placed Successfully!</h2>
                <p className="text-green-700">
                  Thank you for your order. We'll send you updates as your order progresses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              <i className={`${getStatusIcon(order.status)} mr-1`}></i>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">by {item.artisan}</p>
                      {item.materials && item.materials.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Materials: {item.materials.join(', ')}
                        </p>
                      )}
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-gray-600">Price: ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Order Status & Tracking */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                {order.estimatedDelivery && (
                  <div className="flex items-center text-sm">
                    <i className="ri-calendar-line text-gray-400 mr-2"></i>
                    <span className="text-gray-600">Estimated delivery:</span>
                    <span className="ml-1 font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="flex items-center text-sm">
                    <i className="ri-truck-line text-gray-400 mr-2"></i>
                    <span className="text-gray-600">Tracking number:</span>
                    <span className="ml-1 font-mono font-medium">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push('/shop')}
              >
                Continue Shopping
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push('/account/orders')}
              >
                View All Orders
              </Button>
              {order.status === 'delivered' && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => router.push(`/products/${order.items[0]?.productId}?review=true`)}
                >
                  Leave a Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

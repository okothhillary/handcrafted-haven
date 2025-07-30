'use client';

import { useOrders, useOrderActions } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '@/contexts/OrderContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import AuthGuard from '@/components/auth/AuthGuard';

function OrdersContent() {
  const { state } = useOrders();
  const { reorder } = useOrderActions();
  const router = useRouter();

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

  const handleReorder = async (orderId: string) => {
    try {
      const newOrder = await reorder(orderId);
      router.push(`/orders/${newOrder.id}`);
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Failed to reorder. Please try again.');
    }
  };

  const sortedOrders = [...state.orders].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>

          <div className="text-center py-12">
            <i className="ri-shopping-bag-line text-6xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
            <Button onClick={() => router.push('/shop')}>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-2">
            {state.orders.length} {state.orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>

        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-gray-500">
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          by {item.artisan}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      +{order.items.length - 3} more {order.items.length - 3 === 1 ? 'item' : 'items'}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
                
                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <Button
                    variant="secondary"
                    onClick={() => handleReorder(order.id)}
                  >
                    <i className="ri-repeat-line mr-2"></i>
                    Reorder
                  </Button>
                )}

                {order.status === 'shipped' && order.trackingNumber && (
                  <Button
                    variant="secondary"
                    onClick={() => window.open(`#`, '_blank')}
                  >
                    <i className="ri-truck-line mr-2"></i>
                    Track Package
                  </Button>
                )}

                {order.status === 'delivered' && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/products/${order.items[0]?.productId}?review=true`)}
                  >
                    <i className="ri-star-line mr-2"></i>
                    Leave Review
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Button
            variant="secondary"
            onClick={() => router.push('/shop')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}

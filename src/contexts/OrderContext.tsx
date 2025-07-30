'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Order interfaces
export interface OrderItem {
  productId: number;
  name: string;
  artisan: string;
  price: number;
  quantity: number;
  image: string;
  materials: string[];
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'LOAD_ORDERS'; payload: Order[] };

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

// Order reducer
function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    
    case 'LOAD_ORDERS':
      return { ...state, orders: action.payload, isLoading: false };
    
    default:
      return state;
  }
}

// Context
const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | null>(null);

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from localStorage on mount
  React.useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('handcrafted_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          date: new Date(order.date),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
        }));
        dispatch({ type: 'LOAD_ORDERS', payload: orders });
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  React.useEffect(() => {
    try {
      localStorage.setItem('handcrafted_orders', JSON.stringify(state.orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }, [state.orders]);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

// Hook to use order context
export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

// Hook for order actions
export function useOrderActions() {
  const { dispatch } = useOrders();

  const createOrder = async (orderData: {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Calculate totals
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + shipping + tax;

      // Generate order
      const order: Order = {
        id: generateOrderId(),
        orderNumber: generateOrderNumber(),
        date: new Date(),
        status: 'processing',
        items: orderData.items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: orderData.shippingAddress,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: 'ADD_ORDER', payload: order });
      return order;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create order' });
      throw error;
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
  };

  const getOrderById = (id: string) => {
    const { state } = useOrders();
    return state.orders.find(order => order.id === id) || null;
  };

  const reorder = async (orderId: string) => {
    const { state } = useOrders();
    const originalOrder = state.orders.find(order => order.id === orderId);
    
    if (!originalOrder) {
      throw new Error('Order not found');
    }

    return createOrder({
      items: originalOrder.items,
      shippingAddress: originalOrder.shippingAddress,
    });
  };

  return {
    createOrder,
    updateOrderStatus,
    getOrderById,
    reorder,
  };
}

// Utility functions
function generateOrderId(): string {
  return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateOrderNumber(): string {
  return 'HH' + Date.now().toString().slice(-8);
}

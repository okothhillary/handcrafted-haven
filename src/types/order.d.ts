export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderType {
  _id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

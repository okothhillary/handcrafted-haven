export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartType {
  _id?: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

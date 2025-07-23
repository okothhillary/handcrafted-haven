export interface ProductType {
  _id?: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

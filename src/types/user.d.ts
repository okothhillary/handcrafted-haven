export interface UserType {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

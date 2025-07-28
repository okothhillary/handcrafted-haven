export interface UserType {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: "user" | "seller" | "admin" ;
  createdAt?: string;
  updatedAt?: string;
}

import { ProductType } from '../enums';

export interface Product {
  id?: string;
  name: string;
  price?: number;
  description?: string;
  type: any;
  inStock: number;
}

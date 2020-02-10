import { User } from '../../general/user.model';
import { Meal } from './meal.model';
import { Grocery } from '../../warehouse/grocery.model';
import { Dessert } from '../../warehouse/desserts.model';

export interface Combo {
  id?: string;
  name: string;
  soldUnits: number;
  price: number;
  realPrice: number;
  validityPeriod: string; //Indefinido, Definido
  dateRange?: {
    begin: Date,
    end: Date
  }
  products: {
    product: Grocery | Meal | Dessert,
    quantity: number
  }[];
  createdAt?: Date;
  createdBy?: User;
  editedAt?: Date;
  editedBy?: User;
  state: string;
}
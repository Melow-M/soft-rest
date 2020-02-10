import { User } from '../../general/user.model';
import { Dessert } from '../../warehouse/desserts.model';
import { Meal } from './meal.model';
import { Grocery } from '../../warehouse/grocery.model';

export interface Promo {
  id?: string;
  name: string;
  quantity: string; //Indefinido, Definido
  units?: number;
  soldUnits: number;
  promoPrice: number;
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

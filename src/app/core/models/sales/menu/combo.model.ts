import { User } from '../../general/user.model';
import { Grocery } from '../../warehouse/grocery.model';
import { Meal } from './meal.model';

export interface Combo {
  id: string;
  name: string; // Jueves de Patas
  sku: string; //COMB9093
  description: string;
  picture: string;
  unit: string; // UND.
  stock: number;
  emergencyStock: number;
  status: string; // DISPONIBLE, INACTIVO
  price: number;
  mealList: Array<Meal>;
  groceryList: Array<Grocery>;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
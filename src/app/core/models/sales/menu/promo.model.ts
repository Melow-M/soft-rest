import { User } from '../../general/user.model';
import { Recipe } from '../../kitchen/recipe.model';

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
  recipes: {
    recipe: Recipe,
    quantity: number
  }[];
  createdAt?: Date;
  createdBy?: User;
  editedAt?: Date;
  editedBy?: User;
  state: string;
}

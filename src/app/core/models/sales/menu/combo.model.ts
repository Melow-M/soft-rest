import { User } from '../../general/user.model';
import { Meal } from './meal.model';
import { Grocery } from '../../warehouse/grocery.model';
import { Dessert } from '../../warehouse/desserts.model';
import { Recipe } from '../../kitchen/recipe.model';

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
  products: productCombo[] | recipeCombo[];
  createdAt?: Date;
  createdBy?: User;
  editedAt?: Date;
  editedBy?: User;
  state: string;
}

export interface productCombo{
  name: string;
  sku: string;
  quantity: number;
  id: string;
  unit: string;
  type?: string; //OTROS POSTRES
}

export interface recipeCombo extends Recipe{
  quantity: number;
  unit: string;
}

export interface productComboTable{
  index: number;
  averageCost: number;
  name: string;
  sku: string;
  quantity: number;
  id: string;
  unit: string;
  type?: string; //OTROS POSTRES
}


export interface recipeComboTable extends Recipe{
  index: number;
  averageCost: number;
  quantity: number;
  unit: string;
}
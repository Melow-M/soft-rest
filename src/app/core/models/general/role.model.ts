export interface Role {
  id: string;
  name: string;
  salesSection: boolean;
  salesMenu: boolean;
  salesHistory: boolean;
  salesCash: boolean;
  warehouseSection: boolean;
  warehousePurchases: boolean;
  warehouseStocktaking: boolean;
  kitchenSection: boolean;
  kitchenRecipes: boolean;
  kitchenDishes: boolean;
  AdministrativeSection: boolean;
  thirdPartiesSection: boolean;
  configurationSection: boolean;
}
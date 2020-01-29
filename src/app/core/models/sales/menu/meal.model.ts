import { User } from '../../general/user.model';

export interface Meal {
  id: string;
  name: string; // Lomo Saltado
  sku: string; //AP102001
  description: string;
  picture: string;
  unit: string; // UND., KG., GR., L., M., PULG. ...
  stock: number;
  emergencyStock: number;
  type: string; // ENTRADA, FONDO, POSTRE, PIQUEO, BEBIDA
  recipeId: string;
  status: string; // DISPONIBLE, COCINANDO, INACTIVO
  price: number;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
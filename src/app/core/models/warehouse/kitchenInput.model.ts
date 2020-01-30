import { User } from '../general/user.model';

export interface kitchenInput {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  unit: string;
  stock: number;
  emergencyStock: number;
  picture: string | null; 
  status: string; // ACTIVO, INACTIVO
  createdAt: Date;
  createdBy: User | null;
  editedAt: Date;
  editedBy: User | null;
}
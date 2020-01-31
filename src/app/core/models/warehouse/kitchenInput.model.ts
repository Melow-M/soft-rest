import { User } from '../general/user.model';

export interface KitchenInput {
  id: string;
  name: string;
  description: string | null;
  sku: string;      //Código
  unit: string;
  stock: number;
  cost: number;
  emergencyStock?: number;
  picture?: string | null; 
  status: string; // ACTIVO, INACTIVO
  createdAt: Date;
  createdBy: User | null;
  editedAt: Date;
  editedBy: User | null;
}

export interface CostTrend{
  cost: number,
  createdAt: Date,
  id: string
}
import { User } from '../general/user.model';

export interface Recipe {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  picture?: string | null;
  inputs: Array<{
    name: string;
    sku: string;
    quantity: number;
    inputId: string;
  }>;
  createdAt: Date;
  createdBy: User | null;
  editedAt: Date;
  editedBy: User | null;
}
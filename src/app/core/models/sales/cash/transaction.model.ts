import { User } from '../../general/user.model';

export interface Transaction {
  id: string;
  // type: string;
  description?: string;
  amount: number;
  verified: boolean;
  status: string;
  ticketType: string;
  paymentType: string;
  expenseType?: string;
  // departureType?: string;
  originAccount?: string;
  destinationAccount?: string;
  debt?: number;
  editedBy: User;
  editedAt: number;
  approvedBy: User;
  approvedAt: Date;
  createdAt: Date;
  createdBy: User;
}
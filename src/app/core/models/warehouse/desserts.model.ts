import { User } from '../general/user.model';

export interface Dessert {
  id: string;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
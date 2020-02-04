import { User } from '../general/user.model';

export interface Household {
  id: string;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
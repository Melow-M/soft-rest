import { User } from '../../general/user.model';

export interface Promo {
  id: string;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
import { User } from '../../general/user.model';

export interface Cash {
  id: string;
  currentOwner: string;
  currentOpeningId: string;
  name: string;
  open: boolean;
  password: string;
  supervisorName: string;
  supervisorId: string;
  lastOpening: Date;
  lastClosure: Date;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
import { User } from '../general/user.model';

export interface ReceivableUser {
    id: string;
    name?: string;
    dni: number;
    phone?: string;
    mail?: string;
    balance: number;
    negativeValue: boolean;
    createdBy: User;
    createdAt: Date;
    editedBy?: User;
    editedAt?: Date;
}
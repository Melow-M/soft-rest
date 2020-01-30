import { User } from '../general/user.model';

export interface Provider {
    id: string;
    ruc: number;
    name: string;
    address: string;
    phone?: string;
    detractionAccount?: string;

    bankAccounts?: Array<{  //Opciones dadas en interiores
        bank: string;   
        type: string;
        accountNumber: string;
    }>;

    contacts?: Array<{
        contactName: string;
        contactPhone: string;
        contactMail: string;
    }>;

    regDate: number;
    createdBy: string;
    createdAt: Date;
    editedBy?: User;
    editedAt?: Date;
}
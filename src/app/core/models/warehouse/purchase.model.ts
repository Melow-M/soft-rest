import { User } from '../general/user.model';
import { Input } from './input.model';
import { Provider } from '../third-parties/provider.model';

export interface Purchase {
    documentDetails: {
        id: string;
        documentDate: number;
        documentType: string;           //Factura, boelta y ticket
        documentSerial: number;
        documentCorrelative: number;            
        //socialReason?: string;          //Depends on RUC todo de proveedor//Estara disabled solo mostrar
        provider: Provider;
        paymentType: string;
        creditExpirationDate?: Date;    //Depend on Credito
    }

    imports: {
        subtotalImport?: number;        //Depends on factura
        igvImport?: number;             //Depends on factura
        totalImport: number;
        paidImport: number;
        indebtImport: number;
    }

    itemsList: Array<{
        kitchenInputId: string;
        item: Input;
        quantity: number;
        cost: number;
    }>;

    createdAt: Date;
    createdBy: User;
    editedAt: Date;         //null
    editedBy: User;         //null
    approvedAt: Date;           //null
    approvedBy: User;           //null

    status: string;     //GRABADO, APROBADO, ANULADO

}
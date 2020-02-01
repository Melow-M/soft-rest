import { Provider } from '../third-parties/provider.model';
import { Input } from '@angular/compiler/src/core';
import { Household } from '../warehouse/household.model';
import { Grocery } from '../warehouse/grocery.model';
import { Dessert } from '../warehouse/desserts.model';
import { User } from '../general/user.model';
import { Cash } from '../sales/cash/cash.model';

export interface Payable {
  id: string;
  documentDate: Date;
  documentType: string; // FACTURA, BOLETA, TICKET
  documentSerial: string;
  documentCorrelative: number;
  provider: {
    id: string;
    name: string;
    ruc: number;
  };
  itemsList: Array<{
    id: string;
    type: string; //INSUMO, MENAJE, POSTRE, OTROS
    name: string;
    sku: string;
    quantity: number;
    amount: number;regDate
  }>;
  payments: Array<{
    type: string;
    paymentType: string;
    amount: number;
    paidAt: Date;
    paidBy: User;
  }>;
  creditDate: Date;
  paymentDate: Date;
  totalAmount: number;
  subtotalAmount: number;
  igvAmount: number;
  paymentType: string; // CREDITO, EFECTIVO, TARJETA
  paidAmount: number;
  indebtAmount: number;
  status: string; // PENDIENTE, PAGADO, ANULADO
  cashReference: {
    id: string;
    name: string;
  }
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
  approvedAt: Date;
  approvedBy: User;
}
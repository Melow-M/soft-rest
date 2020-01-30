import { User } from '../../general/user.model';
import { Menu } from './menu.model';
import { Meal } from './meal.model';
import { Combo } from './combo.model';
import { Promo } from './promo.model';
import { Grocery } from './grocery.model';

export interface Order {
  id: string;
  orderCorrelative: number;
  orderList: Array<Menu | Meal | Combo | Promo | Grocery>;
  orderStatus: string // SELECCIONANDO, PAGADO, ANULADO
  price: number;
  discount?: number;
  igv?: number;
  total: number;
  paymentType: string; // EFECTIVO, VISA, MASTERCARD
  amountReceived: number;
  amountChange: number;
  documentType: string; // FACTURA, BOLETA, TICKET
  documentSerial?: string; // FE001 ...
  documentCorrelative?: string; // 0000124 ...
  customerId: string;
  canceledAt: Date;
  canceledBy: User;
  createdAt: Date;
  createdBy: User;
  editedAt: Date;
  editedBy: User;
}
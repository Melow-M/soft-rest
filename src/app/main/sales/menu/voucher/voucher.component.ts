import { Transaction } from './../../../../core/models/sales/cash/transaction.model';
import { take, filter, map } from 'rxjs/operators';
import { Order } from './../../../../core/models/sales/menu/order.model';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { DatabaseService } from './../../../../core/database.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialog: MatDialogRef<VoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    let dishes = this.data['orderList'].filter(el => el['type']).map(el => {
      let array = []
      switch (el['type']) {
        case 'executive':
          array.push({
            name: el['appetizer']['name'],
            id: el['appetizer']['id']
          })
          array.push({
            name: el['mainDish']['name'],
            id: el['mainDish']['id']
          })
          array.push({
            name: el['dessert']['name'],
            id: el['dessert']['id']
          })
          return array
          break;
        case 'simple':
          array.push({
            name: el['appetizer']['name'],
            id: el['appetizer']['id']
          })
          array.push({
            name: el['mainDish']['name'],
            id: el['mainDish']['id']
          })
          return array
          break;
        case 'second':
          return {
            name: el['mainDish']['name'],
            id: el['mainDish']['id'],
          }
          break;
        default:
          break;
      }
    })
    let orders = this.data['orderList'].filter(el => el['id']).map(el => {
      return {
        name: el['name'],
        id: el['id'],
        amount: el['amount']
      }
    })
    console.log(orders);
    console.log(dishes.reduce((a, b) => a.concat(b)));


  }


  newCustomer(type) {
    const batch = this.af.firestore.batch();

    const customerRef = this.af.firestore.collection(this.dbs.customersCollection.ref.path).doc();

    let data;

    this.auth.user$
      .pipe(
        take(1)
      )
      .subscribe(user => {
        if (type === 'NATURAL') {
          data = {
            id: customerRef.id,
            type: type,
            name: this.data['customerId']['name'],
            dni: this.data['customerId']['dni'],
            phone: this.data['customerId']['phone'] ? this.data['customerId']['phone'] : "",
            mail: '',
            createdAt: new Date(),
            createdBy: user,
            editedBy: null,
            editedDate: null
          }
        } else {
          data = {
            id: customerRef.id,
            type: type,
            businessName: this.data['customerId']['businessName'],
            businessAddress: this.data['customerId']['address'],
            ruc: this.data['customerId']['ruc'],
            businessPhone: this.data['customerId']['phone'],
            contacts: null,
            createdAt: new Date(),
            createdBy: user,
            editedBy: null,
            editedDate: null
          }
        }

        batch.set(customerRef, data);

        this.data['customerId'] = customerRef.id
        batch.commit()
          .then(() => {
            console.log('cliente guardado');

          })
      })


  }

  save() {
    let batch = this.af.firestore.batch();
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/orders/`).doc();
    let transactionRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/cashRegisters/${this.data['cashId']}/openings/${this.data['openingId']}/transactions`).doc(inputRef.id);

    let inputData: Order;
    let transactionData: Transaction;

    if (typeof this.data['customerId'] == 'object') {
      if (this.data['customerId']['dni']) {
        this.newCustomer('NATURAL')
      } else {
        this.newCustomer('EMPRESA')
      }
    }

    this.auth.user$.pipe(
      take(1))
      .subscribe(user => {
        inputData = {
          id: inputRef.id,
          orderCorrelative: 0,
          orderList: this.data['orderList'],
          orderStatus: 'PAGADO',
          price: 0,
          discount: 0,
          igv: 0,
          total: this.data['total'],
          paymentType: this.data['paymentType'],
          amountReceived: this.data['amountReceived'],
          amountChange: this.data['amountChange'],
          documentType: this.data['documentType'],
          documentSerial: this.data['documentSerial'], // FE001 ...
          documentCorrelative: this.data['documentCorrelative'], // 0000124 ...
          customerId: this.data['customerId'],
          cashId: this.data['cashId'],
          openingId: this.data['openingId'],
          canceledAt: null,
          canceledBy: null,
          createdAt: new Date(),
          createdBy: user,
          editedAt: new Date(),
          editedBy: user
        }

        transactionData = {
          id: inputRef.id,
          type: 'Ingreso',
          description: 'Venta ' + this.data['documentSerial'] + '-' + this.data['documentCorrelative'],
          amount: this.data['total'],
          status: 'PAGADO',
          ticketType: this.data['documentType'],
          paymentType: this.data['paymentType'].toUpperCase(),
          editedBy: user,
          editedAt: new Date(),
          createdAt: new Date(),
          createdBy: user,
        }


        batch.set(inputRef, inputData);

        batch.set(transactionRef, transactionData)

        batch.commit().then(() => {
          console.log('orden guardada');
          this.dialog.close()
        })
      })

  }

}

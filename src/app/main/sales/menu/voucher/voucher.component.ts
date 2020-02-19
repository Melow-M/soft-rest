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

  orders: Array<any>
  countDishes: Array<any>
  print: Array<any>

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
            id: el['appetizer']['id'],
            stock: el['appetizer']['stock']
          })
          array.push({
            name: el['mainDish']['name'],
            id: el['mainDish']['id'],
            stock: el['mainDish']['stock']
          })
          array.push({
            name: el['dessert']['name'],
            id: el['dessert']['id'],
            stock: el['dessert']['stock']
          })
          return array
          break;
        case 'simple':
          array.push({
            name: el['appetizer']['name'],
            id: el['appetizer']['id'],
            stock: el['appetizer']['stock']
          })
          array.push({
            name: el['mainDish']['name'],
            id: el['mainDish']['id'],
            stock: el['mainDish']['stock']
          })
          return array
          break;
        case 'second':
          array.push({
            name: el['mainDish']['name'],
            id: el['mainDish']['id'],
            stock: el['mainDish']['stock']
          })
          return array
          break;
        default:
          break;
      }
    })

    this.countDishes = dishes.reduce((a, b) => a.concat(b), []).map((el, index, array) => {
      let counter = 0
      array.forEach(al => {
        if (al['id'] == el['id']) {
          counter++
        }
      })
      return {
        ...el,
        amount: counter
      }
    }).filter((dish, index, array) => array.findIndex(el => el['id'] === dish['id']) === index)

    this.orders = this.data['orderList'].filter(el => el['id']).map(el => {
      return {
        name: el['name'],
        id: el['id'],
        amount: el['amount'],
        stock: el['stock'],
        price: el['price'],
      }
    })

    this.print = this.data['orderList'].map(el => {
      console.log(el);
      return {
        quantity: el['amount'],
        description: el['name'],
        vUnit: el['price'],
        import: el['amount'] * el['price'],
        element: el
      }
    }).map((el, index, array) => {
      let counter = 0
      array.forEach(al => {
        if (al['description'] == el['description']) {
          counter++
        }
      })
      if (el['quantity'] < counter) {
        el['quantity'] = counter
      }

      return el
    }).filter((dish, index, array) => array.findIndex(el => el['description'] === dish['description']) === index)


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
          orderCorrelative: this.data['orderCorrelative'],
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
          status: this.data['receivable'] ? 'DEUDA' : 'PAGADO',
          ticketType: this.data['documentType'],
          paymentType: this.data['paymentType'].toUpperCase(),
          editedBy: user,
          editedAt: new Date(),
          createdAt: new Date(),
          createdBy: user,
        }

        if (this.data['receivable']) {
          let receivableUserRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/receivableUsers/`).doc(this.data['account']);
          let receivableRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/receivableUsers/${this.data['account']}/list`).doc(inputRef.id);

          let receivableData = {
            id: inputRef.id,
            orderList: this.data['orderList'],
            description: 'Venta ' + this.data['documentSerial'] + '-' + this.data['documentCorrelative'],
            amount: this.data['total'],
            ticketType: this.data['documentType'],
            paymentType: this.data['paymentType'].toUpperCase(),
            editedBy: user,
            editedAt: new Date(),
            createdAt: new Date(),
            createdBy: user,
          }

          batch.set(receivableRef, receivableData)

          batch.update(receivableUserRef,{
            indebtAmount: this.data['total']
          })
        }

        batch.set(inputRef, inputData);

        batch.set(transactionRef, transactionData)


        this.countDishes.forEach(dish => {
          let dishRef = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc(dish['id']);

          batch.update(dishRef, {
            stock: dish['stock'] - dish['amount']
          })
        })

        this.orders.forEach(order => {
          let groceryRef = this.af.firestore.collection(`/db/deliciasTete/warehouseGrocery/`).doc(order['id']);
          let kardexRef = this.af.firestore.collection(`/db/deliciasTete/warehouseGrocery/${order['id']}/kardex`).doc(inputRef.id)

          let inputKardex = {
            id: inputRef.id,
            details: this.data['documentType'] + ': ' + this.data['documentSerial'] + '-' + this.data['documentCorrelative'],
            insQuantity: 0,
            insPrice: 0,
            insTotal: 0,
            outsQuantity: order['amount'],
            outsPrice: order['price'],
            outsTotal: order['amount'] * order['price'],
            balanceQuantity: 0,
            balancePrice: 0,
            balanceTotal: 0,
            type: 'SALIDA',
            createdAt: new Date(),
            createdBy: user
          }

          batch.update(groceryRef, {
            stock: order['stock'] - order['amount']
          })

          batch.set(kardexRef, inputKardex)
        })


        this.dbs.printTicket(this.print, this.data['documentSerial'] + '-' + this.data['documentCorrelative'])
        
        batch.commit().then(() => {
          console.log('orden guardada');
          this.dialog.close()
        })
      })

  }

}

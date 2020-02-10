import { take } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { DatabaseService } from './../../../../core/database.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {
  orders: Array<any>
  countDishes: Array<any>

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialog: MatDialogRef<CancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    console.log(this.data);
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
          return {
            name: el['mainDish']['name'],
            id: el['mainDish']['id'],
            stock: el['mainDish']['stock']
          }
          break;
        default:
          break;
      }
    })

    this.countDishes = dishes.reduce((a, b) => a.concat(b)).map((el, index, array) => {
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
        price: el['price']
      }
    })


  }
  cancel() {
    let batch = this.af.firestore.batch();
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/orders/`).doc(this.data['id']);
    let transactionRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/cashRegisters/${this.data['cashId']}/openings/${this.data['openingId']}/transactions`).doc(this.data['id']);

    this.auth.user$.pipe(
      take(1))
      .subscribe(user => {
        let inputUpdate = {
          orderStatus: 'ANULADO',
          canceledAt: new Date(),
          canceledBy: user
        }

        batch.update(inputRef, inputUpdate);

        let transactionUpdate = {
          status: 'ANULADO',
          editAt: new Date(),
          editBy: user
        }
        batch.update(transactionRef, transactionUpdate);

        this.countDishes.forEach(dish => {
          let dishRef = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc(dish['id']);

          batch.update(dishRef, {
            stock: dish['stock'] 
          })
        })

        this.orders.forEach(order => {
          let groceryRef = this.af.firestore.collection(`/db/deliciasTete/warehouseGrocery/`).doc(order['id']);
          let kardexRef = this.af.firestore.collection(`/db/deliciasTete/warehouseGrocery/${order['id']}/kardex`).doc(this.data['id'])

          batch.update(groceryRef, {
            stock: order['stock'] 
          })

          batch.update(kardexRef, {
            type: 'ANULADO'
          })
        })

        batch.commit().then(() => {
          console.log('orden anulada');
          this.dialog.close()
        })
      })
  }
}

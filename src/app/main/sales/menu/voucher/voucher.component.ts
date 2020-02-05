import { take } from 'rxjs/operators';
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
    console.log(this.data);

  }

  save() {
    let batch = this.af.firestore.batch();
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/orders/`).doc();
    let inputData: Order;

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
          customerId: '',
          canceledAt: null,
          canceledBy: null,
          createdAt: new Date(),
          createdBy: user,
          editedAt: new Date(),
          editedBy: user
        }

        batch.set(inputRef, inputData);

        batch.commit().then(() => {
          console.log('orden guardada');
          this.dialog.close()
        })
      })


  }

}

import { Transaction } from './../../../../core/models/sales/cash/transaction.model';
import { take } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { User } from 'firebase';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  typesIncome = ['VENTA', 'OTRO']
  typesPayment = ['EFECTIVO', 'TRANSFERENCIA']

  confirm: boolean = false
  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialog: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dbs.getUsers()
  }

  ngOnInit() {
  }

  save() {
    let batch = this.af.firestore.batch();
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/cashRegisters/${this.data['id']}/openings/${this.data['currentOpeningId']}/transactions`).doc();
    let inputData: Transaction;


    this.auth.user$.pipe(
      take(1))
      .subscribe(user => {
        inputData = {
          id: inputRef.id,
          // type: '',
          description: '',
          amount: 0,
          verified: true,
          status: '',
          ticketType: '',
          paymentType: '',
          originAccount: '',
          editedBy: user,
          editedAt: 0,
          approvedBy: user,
          approvedAt: new Date(),
          createdAt: new Date(),
          createdBy: user,
        }

        batch.set(inputRef, inputData);

        batch.commit().then(() => {
          console.log('orden guardada');
          this.dialog.close()
        })
      })

  }

}

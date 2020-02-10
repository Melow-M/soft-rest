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

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialog: MatDialogRef<CancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }
  cancel() {
    let batch = this.af.firestore.batch();
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/orders/`).doc(this.data['id']);

    this.auth.user$.pipe(
      take(1))
      .subscribe(user => {
        let inputUpdate = {
          orderStatus: 'ANULADO',
          canceledAt: new Date(),
          canceledBy: user
        }

        batch.update(inputRef, inputUpdate);

        batch.commit().then(() => {
          console.log('orden anulada');
          this.dialog.close()
        })
      })
  }
}

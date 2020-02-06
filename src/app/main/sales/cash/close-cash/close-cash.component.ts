import { FormGroup, Validators, FormBuilder, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { take, debounceTime, map } from 'rxjs/operators';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { DatabaseService } from './../../../../core/database.service';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-close-cash',
  templateUrl: './close-cash.component.html',
  styleUrls: ['./close-cash.component.css']
})
export class CloseCashComponent implements OnInit {
  hidePass: boolean = true;
  checked: boolean = false

  bills: Array<any> = [
    {
      name: 'Billete S/. 200',
      value: 200,
      quantity: 2
    },
    {
      name: 'Billete S/. 100',
      value: 100,
      quantity: 0
    },
    {
      name: 'Billete S/. 50',
      value: 50,
      quantity: 0
    },
    {
      name: 'Billete S/. 20',
      value: 20,
      quantity: 1
    },
    {
      name: 'Billete S/. 10',
      value: 10,
      quantity: 1
    },
    {
      name: 'Moneda S/. 5',
      value: 5,
      quantity: 0
    },
    {
      name: 'Moneda S/. 2',
      value: 2,
      quantity: 0
    },
    {
      name: 'Moneda S/. 1',
      value: 1,
      quantity: 0
    },
    {
      name: 'Otras Monedas',
      value: 1,
      quantity: 0
    },

  ]

  closingForm: FormGroup

  displayedColumns: string[] = ['name', 'quantity', 'total'];
  dataSource = new MatTableDataSource();

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private fb: FormBuilder,
    private af: AngularFirestore,
    private dialog: MatDialogRef<CloseCashComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.createForm()
    this.dataSource.data = this.bills
  }

  createForm() {
    this.closingForm = this.fb.group({
      password: ['', [Validators.required], [this.matchPassword()]],
      amount: ['', Validators.required]
    })
  }
  matchPassword(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        map(pass => {
          return pass !== this.data.password ? { passValid: true } : null
        })
      );
    }
  }
  close() {
    let batch = this.af.firestore.batch();
    let cashRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/cashRegisters/`).doc(this.data['id']);
    let openingRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/cashRegisters/${this.data['id']}/openings`).doc(this.data['currentOpeningId']);


    this.auth.user$.pipe(
      take(1))
      .subscribe(user => {
        const openUpdate = {
          closedAt: new Date(),
          closedBy: user,
          closureBalance: this.data['amount']
        }

        const inputUpdate = {
          open: true,
          currentOwnerName: '',
          currentOwnerId: '',
          currentOpeningId: '',
          lastClosure: new Date()
        }


        batch.update(openingRef, openUpdate)
        batch.update(cashRef, inputUpdate)

        batch.commit().then(() => {
          console.log('open');
          this.dialog.close()
        })
      })

  }

}

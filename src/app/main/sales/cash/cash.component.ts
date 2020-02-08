import { AuthService } from './../../../core/auth.service';
import { Cash } from './../../../core/models/sales/cash/cash.model';
import { DatabaseService } from './../../../core/database.service';
import { OpenCashComponent } from './open-cash/open-cash.component';
import { RecordComponent } from './record/record.component';
import { TotalsComponent } from './totals/totals.component';
import { AddComponent } from './add/add.component';
import { RemoveComponent } from './remove/remove.component';
import { CloseCashComponent } from './close-cash/close-cash.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { map, tap, startWith, take, distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {
  hidePass: boolean = true;

  cashRegisters: Array<string> = ['Caja 1', 'Caja 2', 'Caja 3']


  cashInfo: Array<any> = [
    {
      date: new Date(),
      type: 'Ingreso',
      description: 'Saldo compras insumos',
      amount: 30,
      user: 'Juan Perez',
      payment: 'Efectivo'
    },
    {
      date: new Date(),
      type: 'Egreso',
      description: 'Retiro Efectivo MTP',
      amount: 50,
      user: 'Maritza Torres',
      payment: 'Efectivo'
    },
    {
      date: new Date(),
      type: 'Ingreso',
      description: 'Dio en efectivo',
      amount: 100,
      user: 'Maria Ponce',
      payment: 'Efectivo'
    },
    {
      date: new Date(),
      type: 'Egreso',
      description: 'Compras insumos',
      amount: 230,
      user: 'Juan Perez',
      payment: 'Efectivo'
    },
    {
      date: new Date(),
      type: 'Ingreso',
      description: 'Ventas del día',
      amount: 980,
      user: 'Caja 1',
      payment: 'Efectivo'
    }
  ]

  isOpening$: Observable<boolean>

  openingForm: FormGroup

  cashRegisters$: Observable<any>

  currentCash: Cash = null

  displayedColumns: string[] = ['index', 'date', 'type', 'description', 'amount', 'user', 'payment', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild("firstView", { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(
    private dialog: MatDialog,
    public dbs: DatabaseService,
    private fb: FormBuilder,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.createForm()
    this.dataSource.data = this.cashInfo

    this.isOpening$ = combineLatest(
      this.dbs.getCashes(),
      this.auth.user$
    ).pipe(
      map(([cashes, user]) => {
        this.currentCash = cashes.filter(el => el['open'])[0]
        let cashOpen = cashes.filter(el => el['open']).filter(el => el['currentOwnerId'] == user.uid)
        return cashOpen.length == 1
      })
    )

    this.cashRegisters$ = this.dbs.getCashes()

  }

  createForm() {
    this.openingForm = this.fb.group({
      cash: ['', Validators.required],
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
          return pass !== this.currentCash.password ? { passValid: true } : null
        })
      );
    }
  }

  openCash() {
    this.dialog.open(OpenCashComponent, {
      data: {
        cash: this.currentCash,
        amount: this.openingForm.get('amount').value
      }
    })
  }

  closeCash() {
    this.dialog.open(CloseCashComponent, {
      data: this.currentCash
    })
  }

  removeMoney() {
    this.dialog.open(RemoveComponent, {
      data: this.currentCash
    })
  }

  addMoney() {
    this.dialog.open(AddComponent, {
      data: this.currentCash
    })
  }

  totals() {
    this.dialog.open(TotalsComponent, {
      data: this.currentCash
    })
  }

  record() {
    this.dialog.open(RecordComponent, {
      data: this.currentCash
    })
  }

}

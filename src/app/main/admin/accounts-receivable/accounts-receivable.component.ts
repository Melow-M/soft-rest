import { PaymentsComponent } from './payments/payments.component';
import { ListComponent } from './list/list.component';
import { TotalPayComponent } from './total-pay/total-pay.component';
import { PartialPayComponent } from './partial-pay/partial-pay.component';
import { CreateComponent } from './create/create.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { Customer } from "src/app/core/models/third-parties/customer.model";
import { ReceivableUser } from "src/app/core/models/admin/receivableUser.model";

import { tap, map, startWith, debounceTime, distinctUntilChanged, take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styles: []
})
export class AccountsReceivableComponent implements OnInit {

  loadingCustomers = new BehaviorSubject(false);
  loadingCustomer$ = this.loadingCustomers.asObservable();

  filterFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'name', 'indebtAmount', 'paidAmount', 'itemsList', 'payments', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  customers$: Observable<ReceivableUser[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.customers$ =
      combineLatest(
        this.observeCustomer(),
        this.filterFormControl.valueChanges.pipe(startWith<any>(''), debounceTime(300), distinctUntilChanged())
      ).pipe(
        map(([customers, filterKey]) => {
          let array = customers.map(el => {
            this.dbs.getListReceivable(el['id']).pipe(
              map(list => {
                return list.reduce((a, b) => a + b['amount'], 0)
              }),
              take(1)
            ).subscribe(e => {
              el['indebtAmount'] = e
            })
            return el
          })

          this.dataSource.data = array;
          this.dataSource.filter
          
          
          
          
          
          = filterKey;
          this.loadingCustomers.next(false);

          return array;
        })
      )
  }

  observeCustomer(): Observable<ReceivableUser[]> {
    this.loadingCustomers.next(true);

    return this.dbs.getReceivableUsers()
      .pipe(
        tap(res => {
          this.loadingCustomers.next(false);
        })
      )
  }

  onChangeBalance(raw: ReceivableUser) {

  }

  create() {
    this.dialog.open(CreateComponent)
  }

  partialPay() {
    this.dialog.open(PartialPayComponent)
  }

  totalPay() {
    this.dialog.open(TotalPayComponent)
  }

  list(id) {
    this.dialog.open(ListComponent, {
      data: id
    })
  }

  showPayments(id) {
    this.dialog.open(PaymentsComponent, {
      data: id
    })
  }
}

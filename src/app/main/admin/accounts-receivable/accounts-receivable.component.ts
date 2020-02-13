import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { Customer } from "src/app/core/models/third-parties/customer.model";
import { ReceivableUser } from "src/app/core/models/admin/receivableUser.model";

import { tap, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styles: []
})
export class AccountsReceivableComponent implements OnInit {

  loadingCustomers = new BehaviorSubject(false);
  loadingCustomer$ = this.loadingCustomers.asObservable();

  filterFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'name', 'balance', 'dni', 'phone', 'createdBy', 'actions'];


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
          console.log(customers);

          this.dataSource.data = customers;
          this.dataSource.filter = filterKey;
          this.loadingCustomers.next(false);

          return customers;
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

  onChangeBalance(raw: ReceivableUser){

  }


}

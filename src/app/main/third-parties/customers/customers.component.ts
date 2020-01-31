import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { Customer } from "src/app/core/models/third-parties/customer.model";
import { tap, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ContactsDialogComponent } from './contacts-dialog/contacts-dialog.component';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styles: []
})
export class CustomersComponent implements OnInit {

  loadingCustomers = new BehaviorSubject(false);
  loadingCustomer$ = this.loadingCustomers.asObservable();

  filterFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'name', 'dni', 'phone', 'mail', 'contact', 'createdBy', 'editedBy', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  customers$: Observable<Customer[]>;

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
          const list = customers.filter(option => {
            if (option.type === 'NATURAL') {
              return option.dni.toString().includes(filterKey);
            } else {
              return option.ruc.toString().includes(filterKey);
            }
          });

          const filteredList = list.length ? list : customers;
          this.dataSource.data = filteredList;

          return filteredList;
        })
      )
  }

  observeCustomer(): Observable<Customer[]> {
    this.loadingCustomers.next(true);

    return this.dbs.getCustomers()
      .pipe(
        tap(res => {
          this.loadingCustomers.next(false);
        })
      )
  }

  openContactList(customer: Customer): void {
    this.dialog.open(ContactsDialogComponent, {
      data: {
        customer: customer
      }
    });
  }

  createCustomer(): void {
    this.dialog.open(CreateDialogComponent);
  }

  editCustomer(customer: Customer): void {
    this.dialog.open(EditDialogComponent, {
      data: {
        customer: customer
      }
    });
  }

  deleteCustomer(customer: Customer): void {
    this.dialog.open(DeleteConfirmComponent, {
      data: {
        customer: customer
      }
    });
  }

}

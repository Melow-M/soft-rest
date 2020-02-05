import { User } from './../../../core/models/general/user.model';
import { ListProductsComponent } from './list-products/list-products.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { tap, filter, startWith, map } from 'rxjs/operators';
import { DatabaseService } from './../../../core/database.service';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Order } from 'src/app/core/models/sales/menu/order.model';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.css']
})
export class SalesRecordComponent implements OnInit {

  data$: Observable<Order[]>
  users: Array<any> = ['Todos', 'Caja 1', 'Caja 2', 'Caja 3']

  displayedColumns: string[] = ['index', 'date', 'documentType', 'numberDocument', 'client', 'cashSale', 'products', 'user', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  search: FormGroup
  filteredUsers$: Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.search = this.fb.group({
      initDate: [''],
      lastDate: [''],
      users: ['']
    })

    this.data$ =
      combineLatest(
        this.dbs.getOrders(),
        this.search.get('users').valueChanges.pipe(
          startWith('')
        ),
        this.search.get('initDate').valueChanges.pipe(
          startWith('')
        ),
        this.search.get('lastDate').valueChanges.pipe(
          startWith('')
        ),
      ).pipe(
        map(([orders, user, init, final]) => {
          return orders.filter(el => user['displayName'] ? el['createdBy']['displayName'] == user['displayName'] : true).filter(el => {
            if (init || final) {
              return this.filterTime(init, final, el)
            } else {
              return true
            }
          })
        }),
        tap(res => {
          this.dataSource.data = res
        })
      )

    this.filteredUsers$ = combineLatest(
      this.dbs.getUsers(),
      this.search.get('users').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([users, name]) => {
        return name ? users.filter(option => option['displayName'].toLowerCase().includes(name)) : users;
      })
    );

  }

  filterTime(from, to, el) {
    if (from && to) {
      return el['createdAt'].toMillis() >= from.getTime() && el['createdAt'].toMillis() <= to.setHours(23, 59, 59)
    } else {
      if (from) {
        return el['createdAt'].toMillis() >= from.getTime()
      } else if (to) {
         return el['createdAt'].toMillis() <= to.setHours(23, 59, 59)
      }
    }

  }
  showSelectedUser(user): string | undefined {
    return user ? user['displayName'] : undefined;
  }

  viewProducts(list) {
    this.dialog.open(ListProductsComponent, {
      data: list
    })
  }

}

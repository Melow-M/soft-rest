import { Component, OnInit, ViewChild, Provider } from '@angular/core';
import { Order } from 'src/app/core/models/sales/menu/order.model';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { startWith, debounceTime, switchMap, map, tap } from 'rxjs/operators';
import { OrdersShowDetailsComponent } from './orders-show-details/orders-show-details.component';
import { OrdersShowInputsComponent } from './orders-show-inputs/orders-show-inputs.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  loadingOrders = new BehaviorSubject<boolean>(false);
  loadingOrders$ = this.loadingOrders.asObservable();
  
  loadingProviders = new BehaviorSubject<boolean>(false);
  loadingProviders$ = this.loadingProviders.asObservable();

  dateFormControl = new FormControl({begin: new Date(), end: new Date()});

  filterFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'createdAt', 'orderCorrelative', 'document', 'customer', 'orderDetails', 'createdBy'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  currentDate = Date.now();
  
  dateAndOrders$: Observable<Order[]>;
  orders$: Observable<Order[]>;
  providers$: Observable<Provider[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    const view = this.dbs.getCurrentMonthOfViewDate();
    // this.dataFormGroup.get('date').setValue({begin: view.from, end: new Date()});

    this.dateAndOrders$ =
      this.dateFormControl.valueChanges
        .pipe(
          startWith<any>({begin: new Date(), end: new Date()}),
          debounceTime(300),
          switchMap(date => {
            return this.observeOrders(date.begin, date.end);
          })
        );

    this.orders$ =
      combineLatest(
        this.dbs.getCustomers(),
        this.dateAndOrders$,
        this.filterFormControl.valueChanges.pipe(startWith<any>(''))
      ).pipe(
        map(([customers, orders, filterKey]) => {
          const key = filterKey.toLowerCase();

          let customersNamesList = {};

          orders.forEach(order => {
            const temp = customers.filter(customer => customer.id === order.customerId);
            customersNamesList[order.id] = temp[0] ? temp[0].name : '---';
          });


          const list = orders.filter(option =>
            option['orderCorrelative'].toString().includes(key) ||
            customersNamesList[option.id].toLowerCase().includes(key) ||
            option['createdBy']['displayName'].toLowerCase().includes(key)
          );

          if(filterKey === ''){
            this.dataSource.data = orders;
            return orders;
          } else {
            this.dataSource.data = list;
            return list;
          }
        })
      )
  }

  observeOrders(from: Date, to: Date): Observable<Order[]> {
    this.loadingOrders.next(true);

    return this.dbs.onGetOrders(from, to)
      .pipe(
        tap(res => {
          this.loadingOrders.next(false);
        })
      )
  }

  showOrderDetails(order: Order): void {
    this.dialog.open(OrdersShowDetailsComponent, {
      data: order
    });
  }

  showInputs(order: Order): void {
    this.dialog.open(OrdersShowInputsComponent, {
      data: order
    })
  }

}

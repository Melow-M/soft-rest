import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable } from 'rxjs';
import { Order } from 'src/app/core/models/sales/menu/order.model';
import { tap } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { InputDetailsDialogComponent } from './input-details-dialog/input-details-dialog.component';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  //Table
  ordersTableDataSource= new MatTableDataSource();

  ordersTableDisplayedColumns: string[] = [
    'index', 'createdAt', 'orderCorrelative', 'documentSerialdocumentCorrelative', 'customerId', 
    'orderListButton', /*'inputsButton', */'createdBy'
  ]

  //Excel
  headersXlsx: string[] = [
    'Fecha de Creación',
    'Nro de Pedido',
    'Comprobante de referencia',
    'Cliente',
    'Creado por',
  ]

  searchForm: FormGroup;

  ordersData$: Observable<Order[]>

  constructor(
    private fb: FormBuilder,
    private dbs: DatabaseService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  
  @ViewChild('ordersTablePaginator', {static: false}) set matPaginator(mp: MatPaginator){
    this.ordersTableDataSource.paginator = mp;
  }

  
  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.searchForm = this.fb.group({
      dateRange: [{begin: new Date(), end: new Date()}, Validators.required],
      filterControl: [null]
    })
  }

  onGetOrdersKitchen(){
    this.ordersData$ = this.dbs.getOrdersKitchen(this.searchForm.get('dateRange').value['begin'],
                        this.searchForm.get('dateRange').value['end']).pipe(tap(orders => {
                          this.ordersTableDataSource.data = orders;
                        }));
  }

  filter(){
    this.ordersTableDataSource.filter = this.searchForm.get('filterControl').value;
  }

  onGetOrderDetails(order: Order){
    this.dialog.open(OrderDetailsDialogComponent, {
      data: order
    });
  }

  onGetOrderInputs(order: Order){
    this.dialog.open(InputDetailsDialogComponent, {
      data: order
    });
  }

  
  formatDate(date: {seconds: number, nanoseconds: number}){
    let t = new Date(1970);
    t.setSeconds(date.seconds);
    return t;
  }

  downloadXls(): void {
    let table_xlsx: any[] = [];
    let dateRange;
    let availableUnits;
    table_xlsx.push(this.headersXlsx);

    this.ordersTableDataSource.data.forEach((element: Order) => {


      const temp = [
        this.datePipe.transform(this.getDate(element.createdAt['seconds']), 'dd/MM/yyyy'),
        element.orderCorrelative,
        element.documentSerial+" - "+element.documentCorrelative,
        "nombre de cliente",
        element.createdBy.displayName
      ];
      table_xlsx.push(temp);
    })

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `orden`);

    const name = `orden.xlsx`;

    XLSX.writeFile(wb, name);
  }

  getDate(seconds: number){
    let date = new Date(1970);
    date.setSeconds(seconds);
    return date.valueOf();
  }
}

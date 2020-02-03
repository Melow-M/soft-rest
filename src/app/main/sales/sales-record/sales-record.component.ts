import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.css']
})
export class SalesRecordComponent implements OnInit {

   example = [
    {
      date:new Date(),
      documentType: 'Factura',
      numberDocument: 'FE001-0000349',
      client: 'Juan Perez',
      cashSale: 50,
      user: 'Caja 1'
    },
    {
      date:new Date(),
      documentType: 'Factura',
      numberDocument: 'FE001-0000349',
      client: 'Juan Perez',
      cashSale: 50,
      user: 'Caja 1'
    },
    {
      date:new Date(),
      documentType: 'Factura',
      numberDocument: 'FE001-0000349',
      client: 'Juan Perez',
      cashSale: 50,
      user: 'Caja 1'
    },
    {
      date:new Date(),
      documentType: 'Factura',
      numberDocument: 'FE001-0000349',
      client: 'Juan Perez',
      cashSale: 50,
      user: 'Caja 1'
    }
  ]

  users:Array<any> = ['Todos', 'Caja 1', 'Caja 2', 'Caja 3']

  displayedColumns: string[] = ['index', 'date', 'documentType', 'numberDocument', 'client', 'cashSale', 'products', 'user', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.example
  }

}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {
  opening: boolean = true


  cashRegisters: Array<string> = ['Caja 1', 'Caja 2', 'Caja 3']
  hidePass: boolean = true;


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

  displayedColumns: string[] = ['index', 'date', 'type', 'description', 'amount', 'user', 'payment', 'actions'];
  dataSource = new MatTableDataSource();

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.cashInfo
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit {

  displayedColumns: string[] = ['fuente', 'import'];

  cash:Array<any> = [
    {
      item: 'Importe Inicial',
      amount: 100
    },
    {
      item: 'Total ingresos',
      amount: 1100
    },
    {
      item: 'Egresos',
      amount: 280
    }

  ]

  income:Array<any> = [
    {
      item: 'Ventas',
      amount: 100
    },
    {
      item: 'Ingreso efectivo',
      amount: 1100
    },
    {
      item: 'Tarjeta Visa',
      amount: 280
    },
    {
      item: 'Tarjeta Mastercard',
      amount: 380
    }

  ]

  expenses:Array<any> = [
    {
      item: 'Transferencia',
      amount: 100
    },
    {
      item: 'Egresos',
      amount: 1100
    }

  ]

  constructor() { }

  getTotal(array) {
    return array.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {
  }

}

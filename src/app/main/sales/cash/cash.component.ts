import { take } from 'rxjs/operators';
import { OpenCashComponent } from './open-cash/open-cash.component';
import { RecordComponent } from './record/record.component';
import { TotalsComponent } from './totals/totals.component';
import { AddComponent } from './add/add.component';
import { RemoveComponent } from './remove/remove.component';
import { CloseCashComponent } from './close-cash/close-cash.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';

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

  @ViewChild("firstView", { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.data = this.cashInfo
  }

  openCash() {
    this.dialog.open(OpenCashComponent,{
      data: {
        open: this.opening
      }
    }).afterClosed().pipe(
      take(1)
    )
  }

  closeCash() {
    this.dialog.open(CloseCashComponent).afterClosed().subscribe(res => {
      if (res) {
        this.opening = true
      }
    })
  }

  removeMoney() {
    this.dialog.open(RemoveComponent)
  }

  addMoney() {
    this.dialog.open(AddComponent)
  }

  totals() {
    this.dialog.open(TotalsComponent)
  }

  record() {
    this.dialog.open(RecordComponent)
  }

}

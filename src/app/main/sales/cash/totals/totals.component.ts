import { map, tap } from 'rxjs/operators';
import { CashOpening } from './../../../../core/models/sales/cash/cashOpening.model';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit {

  displayedColumns: string[] = ['fuente', 'import'];

  cash: Array<any>
  income: Array<any>
  expenses: Array<any>


  openingCash$: Observable<any>

  constructor(
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  getTotal(array) {
    return array.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {

    this.openingCash$ = this.dbs.getOpenCash(this.data['id']).pipe(
      map(cashes => {
        return cashes.filter(el => el['id'] == this.data['currentOpeningId'])[0]
      }),
      tap(res => {
        this.expenses = [
          {
            item: 'Transferencia',
            amount: res['totalDeparturesByPaymentType']['TRANSFERENCIA']
          },
          {
            item: 'Egresos',
            amount: res['totalDeparturesByPaymentType']['EFECTIVO']
          }
        ]
        this.income = [
          {
            item: 'Ventas',
            amount: 100
          },
          {
            item: 'Ingreso efectivo',
            amount: res['totalTicketsByPaymentType']['EFECTIVO']
          },
          {
            item: 'Tarjeta Visa',
            amount: res['totalTicketsByPaymentType']['VISA']
          },
          {
            item: 'Tarjeta Mastercard',
            amount: res['totalTicketsByPaymentType']['MASTERCARD']
          }

        ]
        this.cash = [
          {
            item: 'Importe Inicial',
            amount: res['openingBalance']
          },
          {
            item: 'Total ingresos',
            amount: res['totalAmount']
          },
          {
            item: 'Egresos',
            amount: res['totalDepartures']
          }

        ]
      })
    )

  }

}

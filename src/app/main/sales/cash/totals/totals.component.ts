import { map, tap } from 'rxjs/operators';
import { CashOpening } from './../../../../core/models/sales/cash/cashOpening.model';
import { Observable, combineLatest } from 'rxjs';
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

    this.openingCash$ =
      combineLatest(
        this.dbs.getOpenCash(this.data['id']),
        this.dbs.getOrders()
      ).pipe(
        map(([cashes, orders]) => {
          let cash = cashes.filter(el => el['id'] == this.data['currentOpeningId'])[0]
          let ordersPay = orders.filter(el => (el['openingId'] == this.data['currentOpeningId']) && (el['orderStatus'] == 'PAGADO'))
          let efectivo = ordersPay.filter(el => el.paymentType == 'EFECTIVO').map(el => el['total'])
          let visa = ordersPay.filter(el => el.paymentType == 'VISA').map(el => el['total'])
          let mastercard = ordersPay.filter(el => el.paymentType == 'MASTERCARD').map(el => el['total'])

          this.expenses = [
            {
              item: 'Transferencia',
              amount: cash['totalDeparturesByPaymentType']['TRANSFERENCIA']
            },
            {
              item: 'Egresos',
              amount: cash['totalDeparturesByPaymentType']['EFECTIVO']
            }
          ]
          this.income = [
            {
              item: 'Ventas',
              amount: 100
            },
            {
              item: 'Ingreso efectivo',
              amount: efectivo.length ? efectivo.reduce((a, b) => a + b, 0) : 0
            },
            {
              item: 'Tarjeta Visa',
              amount: visa.length ? visa.reduce((a, b) => a + b, 0) : 0
            },
            {
              item: 'Tarjeta Mastercard',
              amount: mastercard ? mastercard.reduce((a, b) => a + b, 0) : 0
            }

          ]
          this.cash = [
            {
              item: 'Importe Inicial',
              amount: cash['openingBalance']
            },
            {
              item: 'Total ingresos',
              amount: cash['totalAmount']
            },
            {
              item: 'Egresos',
              amount: cash['totalDepartures']
            }

          ]
          return cash
        })
      )

  }

}

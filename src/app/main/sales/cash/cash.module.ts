import { CashComponent } from './cash.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashRoutingModule } from './cash-routing.module';
import {
  MatIconModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatMenuModule,
  MatDialogModule,
  MatCheckboxModule,
  MatDatepickerModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenCashComponent } from './open-cash/open-cash.component';
import { CloseCashComponent } from './close-cash/close-cash.component';
import { AddComponent } from './add/add.component';
import { RemoveComponent } from './remove/remove.component';
import { TotalsComponent } from './totals/totals.component';
import { RecordComponent } from './record/record.component';
import { DeleteTransactionComponent } from './delete-transaction/delete-transaction.component';

@NgModule({
  declarations: [
    CashComponent,
    OpenCashComponent,
    CloseCashComponent,
    AddComponent,
    RemoveComponent,
    TotalsComponent,
    RecordComponent,
    DeleteTransactionComponent
  ],
  imports: [
    CommonModule,
    CashRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  entryComponents: [
    CloseCashComponent,
    OpenCashComponent,
    RecordComponent,
    AddComponent,
    RemoveComponent,
    TotalsComponent
  ]
})
export class CashModule { }

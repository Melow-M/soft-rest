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
  MatMenuModule
} from '@angular/material';
import { OpenCashComponent } from './open-cash/open-cash.component';
import { CloseCashComponent } from './close-cash/close-cash.component';

@NgModule({
  declarations: [
    CashComponent,
    OpenCashComponent,
    CloseCashComponent
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
    MatMenuModule
  ]
})
export class CashModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesComponent } from './purchases.component';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { MatDividerModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PurchasesComponent
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    MatDividerModule,
    MatIconModule,
    SatDatepickerModule,
    SatNativeDateModule ,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class PurchasesModule { }

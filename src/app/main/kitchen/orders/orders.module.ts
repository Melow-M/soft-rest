import { NgModule } from '@angular/core';
import { MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatSelectModule, MatOptionModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatMenuModule, MatDatepickerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { InputDetailsDialogComponent } from './input-details-dialog/input-details-dialog.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsDialogComponent,
    InputDetailsDialogComponent,

  ],
  imports: [
    OrdersRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatMenuModule,
    SatDatepickerModule,
    MatDatepickerModule
  ],
  entryComponents: [
    InputDetailsDialogComponent,
    OrderDetailsDialogComponent
  ],

})
export class OrdersModule { }

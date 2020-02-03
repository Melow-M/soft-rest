import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesComponent } from './purchases.component';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { MatDividerModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatOptionModule, MatAutocompleteModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MAT_DATE_LOCALE, MatMenuModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterDocumentsComponent } from './register-documents/register-documents.component';
import { CreateInputDialogComponent } from '../stocktaking/create-input-dialog/create-input-dialog.component';
import { PurchasesCreateProviderDialogComponent } from './purchases-create-provider-dialog/purchases-create-provider-dialog.component';
import { PurchasesShowItemsDialogComponent } from './purchases-show-items-dialog/purchases-show-items-dialog.component';
import { PurchasesShowPaymentsDialogComponent } from './purchases-show-payments-dialog/purchases-show-payments-dialog.component';
import { PurchasesCancelDialogComponent } from './purchases-cancel-dialog/purchases-cancel-dialog.component';

@NgModule({
  declarations: [
    PurchasesComponent,
    RegisterDocumentsComponent,
    CreateInputDialogComponent,
    PurchasesCreateProviderDialogComponent,
    PurchasesShowItemsDialogComponent,
    PurchasesShowPaymentsDialogComponent,
    PurchasesCancelDialogComponent
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
    MatButtonModule,
    MatDialogModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  entryComponents: [
    RegisterDocumentsComponent,
    CreateInputDialogComponent,
    PurchasesCreateProviderDialogComponent,
    PurchasesShowItemsDialogComponent,
    PurchasesShowPaymentsDialogComponent,
    PurchasesCancelDialogComponent
  ],
  providers: [
  ]
})
export class PurchasesModule { }

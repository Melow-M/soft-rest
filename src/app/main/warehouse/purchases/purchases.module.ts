import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesComponent } from './purchases.component';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { MatDividerModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDialogModule, MatOptionModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterDocumentsComponent } from './register-documents/register-documents.component';
import { CreateProviderDialogComponent } from '../../third-parties/providers/create-provider-dialog/create-provider-dialog.component';
import { CreateInputDialogComponent } from '../stocktaking/create-input-dialog/create-input-dialog.component';

@NgModule({
  declarations: [
    PurchasesComponent,
    RegisterDocumentsComponent,
    CreateProviderDialogComponent,
    CreateInputDialogComponent
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
    MatOptionModule
  ],
  entryComponents: [
    RegisterDocumentsComponent,
    CreateProviderDialogComponent,
    CreateInputDialogComponent
  ]
})
export class PurchasesModule { }

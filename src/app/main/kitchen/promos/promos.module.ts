import { NgModule } from '@angular/core';
import { PromosRoutingModule } from './promos-routing.module';
import { PromosComponent } from './promos.component';
import { MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatSelectModule, MatOptionModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatMenuModule } from '@angular/material';
import { CreateNewPromoDialogComponent } from './create-new-promo-dialog/create-new-promo-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ConfirmPromoDialogComponent } from './confirm-promo-dialog/confirm-promo-dialog.component';
import { EditNewPromoDialogComponent } from './edit-new-promo-dialog/edit-new-promo-dialog.component';

@NgModule({
  declarations: [
    PromosComponent,
    CreateNewPromoDialogComponent,
    ConfirmPromoDialogComponent,
    EditNewPromoDialogComponent
  ],
  imports: [
    PromosRoutingModule,
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
    MatMenuModule
  ],
  entryComponents: [
    CreateNewPromoDialogComponent,
    ConfirmPromoDialogComponent
  ],

})
export class PromosModule { }

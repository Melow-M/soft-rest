import { NgModule } from '@angular/core';
import { PromosRoutingModule } from './promos-routing.module';
import { PromosComponent } from './promos.component';
import { MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatSelectModule, MatOptionModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { CreateNewPromoDialogComponent } from './create-new-promo-dialog/create-new-promo-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    PromosComponent,
    CreateNewPromoDialogComponent
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
    CommonModule
  ],
  entryComponents: [
    CreateNewPromoDialogComponent
  ],

})
export class PromosModule { }

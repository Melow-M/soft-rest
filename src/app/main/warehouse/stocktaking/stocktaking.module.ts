import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocktakingComponent } from './stocktaking.component';
import { StocktakingRoutingModule } from './stocktaking-routing.module';
import { CreateInputDialogComponent } from './create-input-dialog/create-input-dialog.component';
import { MatFormFieldModule, MatAutocompleteModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDatepickerModule, MatDialogModule, MatOptionModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';


@NgModule({
  declarations: [
    StocktakingComponent,
    CreateInputDialogComponent
  ],
  imports: [
    CommonModule,
    StocktakingRoutingModule,
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
    CreateInputDialogComponent
  ]
})
export class StocktakingModule { }

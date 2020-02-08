import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2ImgMaxModule } from 'ng2-img-max';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { StocktakingComponent } from './stocktaking.component';
import { StocktakingRoutingModule } from './stocktaking-routing.module';
import { CreateInputDialogComponent } from './create-input-dialog/create-input-dialog.component';
import { MatFormFieldModule, MatAutocompleteModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDatepickerModule, MatDialogModule, MatOptionModule, MatTableModule, MatPaginatorModule, MatProgressBarModule, MatMenuModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { StocktakingEditDialogComponent } from './stocktaking-edit-dialog/stocktaking-edit-dialog.component';
import { StocktakingDeleteConfirmComponent } from './stocktaking-delete-confirm/stocktaking-delete-confirm.component';
import { StocktakingKardexDialogComponent } from './stocktaking-kardex-dialog/stocktaking-kardex-dialog.component';


@NgModule({
  declarations: [
    StocktakingComponent,
    CreateInputDialogComponent,
    StocktakingEditDialogComponent,
    StocktakingDeleteConfirmComponent,
    StocktakingKardexDialogComponent
  ],
  imports: [
    CommonModule,
    StocktakingRoutingModule,
    MatDividerModule,
    MatIconModule,
    SatDatepickerModule,
    SatNativeDateModule,
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
    MatMenuModule,
    MatCheckboxModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    Ng2ImgMaxModule
  ],
  entryComponents: [
    CreateInputDialogComponent,
    StocktakingEditDialogComponent,
    StocktakingDeleteConfirmComponent,
    StocktakingKardexDialogComponent
  ]
})
export class StocktakingModule { }

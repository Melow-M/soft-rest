import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocktakingComponent } from './stocktaking.component';
import { StocktakingRoutingModule } from './stocktaking-routing.module';
import { CreateInputDialogComponent } from './create-input-dialog/create-input-dialog.component';
import { MatFormFieldModule, MatAutocompleteModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatDividerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StocktakingComponent,
    CreateInputDialogComponent
  ],
  imports: [
    CommonModule,
    StocktakingRoutingModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  entryComponents: [
    CreateInputDialogComponent
  ]
})
export class StocktakingModule { }

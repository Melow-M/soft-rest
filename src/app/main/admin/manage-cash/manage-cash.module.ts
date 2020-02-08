import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCashRoutingModule } from './manage-cash-routing.module';
import { ManageCashComponent } from './manage-cash.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatTooltipModule, MatDividerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { ManageCashCreateDialogComponent } from './manage-cash-create-dialog/manage-cash-create-dialog.component';
import { ManageCashDeleteConfirmComponent } from './manage-cash-delete-confirm/manage-cash-delete-confirm.component';
import { ManageCashEditConfirmComponent } from './manage-cash-edit-confirm/manage-cash-edit-confirm.component';
import { ManageCashEditDialogComponent } from './manage-cash-edit-dialog/manage-cash-edit-dialog.component';

@NgModule({
  declarations: [
    ManageCashComponent,
    ManageCashCreateDialogComponent,
    ManageCashDeleteConfirmComponent,
    ManageCashEditConfirmComponent,
    ManageCashEditDialogComponent
  ],
  imports: [
    CommonModule,
    ManageCashRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule
  ],
  entryComponents: [
    ManageCashCreateDialogComponent,
    ManageCashDeleteConfirmComponent,
    ManageCashEditConfirmComponent,
    ManageCashEditDialogComponent
  ]
})
export class ManageCashModule { }

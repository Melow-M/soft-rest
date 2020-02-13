import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsReceivableRoutingModule } from './accounts-receivable-routing.module';
import { AccountsReceivableComponent } from './accounts-receivable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatCheckboxModule, MatDividerModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule } from '@angular/material';


@NgModule({
  declarations: [AccountsReceivableComponent],
  imports: [
    CommonModule,
    AccountsReceivableRoutingModule,
    CommonModule,
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
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ]
})
export class AccountsReceivableModule { }

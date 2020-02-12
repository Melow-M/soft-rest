import { NgModule } from '@angular/core';
import { DishesRoutingModule } from './dishes-routing.module';
import { DishesComponent } from './dishes.component';
import {
  MatIconModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatMenuModule,
  MatDialogModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatTabsModule,
  MatAutocompleteModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MissingInputsComponent } from './missing-inputs/missing-inputs.component';
import { OrdersComponent } from './orders/orders.component';
import { PlanningComponent } from './planning/planning.component';

@NgModule({
  declarations: [
    DishesComponent,
    MissingInputsComponent,
    OrdersComponent,
    PlanningComponent
  ],
  imports: [
    CommonModule,
    DishesRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatTabsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    MissingInputsComponent
  ],

})
export class DishesModule { }

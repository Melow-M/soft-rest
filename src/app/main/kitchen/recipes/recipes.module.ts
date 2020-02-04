import { NgModule } from '@angular/core';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { MatSelectModule, MatDividerModule, MatIconModule, MatOptionModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateNewRecipeDialogComponent } from './create-new-recipe-dialog/create-new-recipe-dialog.component';

@NgModule({
  declarations: [
    RecipesComponent,
    CreateNewRecipeDialogComponent,
  ],
  imports: [
    RecipesRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatOptionModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [
    CreateNewRecipeDialogComponent
  ],

})
export class RecipesModule { }

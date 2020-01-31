import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocktakingComponent } from './stocktaking.component';
import { StocktakingRoutingModule } from './stocktaking-routing.module';
import { CreateInputDialogComponent } from './create-input-dialog/create-input-dialog.component';


@NgModule({
  declarations: [
    StocktakingComponent,
    CreateInputDialogComponent
  ],
  imports: [
    CommonModule,
    StocktakingRoutingModule
  ],
  entryComponents: [
    CreateInputDialogComponent
  ]
})
export class StocktakingModule { }

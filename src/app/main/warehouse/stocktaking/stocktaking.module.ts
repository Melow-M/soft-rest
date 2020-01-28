import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocktakingComponent } from './stocktaking.component';
import { StocktakingRoutingModule } from './stocktaking-routing.module';


@NgModule({
  declarations: [
    StocktakingComponent
  ],
  imports: [
    CommonModule,
    StocktakingRoutingModule
  ]
})
export class StocktakingModule { }

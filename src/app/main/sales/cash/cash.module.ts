import { CashComponent } from './cash.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashRoutingModule } from './cash-routing.module';


@NgModule({
  declarations: [
    CashComponent
  ],
  imports: [
    CommonModule,
    CashRoutingModule
  ]
})
export class CashModule { }

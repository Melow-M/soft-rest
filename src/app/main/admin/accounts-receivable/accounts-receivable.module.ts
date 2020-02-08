import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsReceivableRoutingModule } from './accounts-receivable-routing.module';
import { AccountsReceivableComponent } from './accounts-receivable.component';


@NgModule({
  declarations: [AccountsReceivableComponent],
  imports: [
    CommonModule,
    AccountsReceivableRoutingModule
  ]
})
export class AccountsReceivableModule { }

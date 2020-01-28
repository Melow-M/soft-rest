import { SalesRecordComponent } from './sales-record.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRecordRoutingModule } from './sales-record-routing.module';


@NgModule({
  declarations: [
    SalesRecordComponent
  ],
  imports: [
    CommonModule,
    SalesRecordRoutingModule
  ]
})
export class SalesRecordModule { }

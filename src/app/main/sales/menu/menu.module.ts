import { MenuComponent } from './menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import {
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatDividerModule,
  MatAutocompleteModule
} from '@angular/material';
import { VoucherComponent } from './voucher/voucher.component';

@NgModule({
  declarations: [
    MenuComponent,
    VoucherComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDividerModule,
    MatAutocompleteModule
  ],
  entryComponents:[
    VoucherComponent
  ]
})
export class MenuModule { }

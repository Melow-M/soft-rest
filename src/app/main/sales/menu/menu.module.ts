import { MenuComponent } from './menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { 
  MatIconModule 
} from '@angular/material/icon';

@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MatIconModule
  ]
})
export class MenuModule { }

import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';

// ANGULAR MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MatNativeDateModule,
          MatInputModule,
          MatProgressBarModule, 
          MatDividerModule,
          MatDialogModule,
          MatButtonModule} from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatSidenavModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    
  ],
})
export class MainModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { CreateProviderDialogComponent } from './create-provider-dialog/create-provider-dialog.component';
import { ProvidersComponent } from './providers.component';
import { MatIconModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatOptionModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
      CreateProviderDialogComponent, 
      ProvidersComponent
    ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule
  ],
  entryComponents: [
    CreateProviderDialogComponent
  ]
})
export class ProvidersModule { }

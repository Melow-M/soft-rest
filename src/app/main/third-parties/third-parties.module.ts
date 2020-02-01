import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartiesRoutingModule } from './third-parties-routing.module';
import { CreateProviderDialogComponent } from './providers/create-provider-dialog/create-provider-dialog.component';
import { ProvidersComponent } from './providers/providers.component';


@NgModule({
  declarations: [CreateProviderDialogComponent, ProvidersComponent],
  imports: [
    CommonModule,
    ThirdPartiesRoutingModule
  ]
})
export class ThirdPartiesModule { }

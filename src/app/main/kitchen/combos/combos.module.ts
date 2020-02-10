import { NgModule } from '@angular/core';
import { CombosRoutingModule } from './combos-routing.module';
import { CombosComponent } from './combos.component';
import { CreateNewComboDialogComponent } from './create-new-combo-dialog/create-new-combo-dialog.component';
import { ConfirmComboDialogComponent } from './confirm-combo-dialog/confirm-combo-dialog.component';

@NgModule({
  declarations: [
    CombosComponent,
    CreateNewComboDialogComponent,
    ConfirmComboDialogComponent
  ],
  imports: [
    CombosRoutingModule
  ],
  entryComponents: [

  ],

})
export class CombosModule { }

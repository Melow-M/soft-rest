import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'ventas/menu',
        loadChildren: () => import('./sales/menu/menu.module').then(mod => mod.MenuModule)
      },
      {
        path: 'ventas/historial',
        loadChildren: () => import('./sales/sales-record/sales-record.module').then(mod => mod.SalesRecordModule)
      },
      {
        path: 'ventas/caja',
        loadChildren: () => import('./sales/cash/cash.module').then(mod => mod.CashModule)
      },
      {
        path: 'almacen',
        loadChildren: () => import('./warehouse/warehouse.module').then(mod => mod.WarehouseModule)
      },
      {
        path: 'cocina',
        loadChildren: () => import('./kitchen/kitchen.module').then(mod => mod.KitchenModule)
      },
      {
        path: 'administrador',
        loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
      },
      {
        path: 'terceros',
        loadChildren: () => import('./third-parties/third-parties.module').then(mod => mod.ThirdPartiesModule)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
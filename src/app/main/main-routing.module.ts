import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'ventas',
        loadChildren: () => import('./sales/sales.module').then(mod => mod.SalesModule)
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

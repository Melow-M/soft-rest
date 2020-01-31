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
        path: 'almacen/compras',
        loadChildren: () => import('./warehouse/purchases/purchases.module').then(mod => mod.PurchasesModule)
      },
      {
        path: 'almacen/inventario',
        loadChildren: () => import('./warehouse/stocktaking/stocktaking.module').then(mod => mod.StocktakingModule)
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
        path: 'terceros/clientes',
        loadChildren: () => import('./third-parties/customers/customers.module').then(mod => mod.CustomersModule)
      },
      {
        path: 'terceros/proveedores',
        loadChildren: () => import('./third-parties/providers/providers.module').then(mod => mod.ProvidersModule)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

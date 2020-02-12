import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { tap, filter, take } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ordersView: boolean = true
  inputsView: boolean = false
  menuView: boolean = false

  currentOrder: any

  orders$: Observable<any>

  displayedOrderColumns: string[] = ['index', 'date', 'document', 'menu', 'inputs', 'user', 'actions'];
  dataOrderSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataOrderSource.paginator = paginator;
  }

  displayedMenuColumns: string[] = ['index', 'category', 'dish', 'prepared', 'sold'];
  dataMenuSource = new MatTableDataSource();

  displayedInputsColumns: string[] = ['index', 'input', 'unit', 'amount', 'cost', 'costTotal'];
  dataInputsSource = new MatTableDataSource();

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore
  ) { }

  ngOnInit() {

    this.orders$ = this.dbs.onGetKitchenOrders().pipe(
      tap(res => {
        this.dataOrderSource.data = res
      })
    )
  }

  viewMenu(menu) {
    this.ordersView = false
    this.menuView = true
    this.currentOrder = {
      name: menu['sku'],
      date: menu['createdAt'],
      list: [
        {
          name: 'Menú Ejecutivo',
          list: menu['menu'].filter(el => el['menuType'] == 'executive')
        },
        {
          name: 'Menú Básico',
          list: menu['menu'].filter(el => el['menuType'] == 'simple')
        },
        {
          name: 'Segundo',
          list: menu['menu'].filter(el => el['menuType'] == 'second')
        }
      ]
    }
  }

  viewInputs(menu) {
    this.inputsView = true
    this.ordersView = false
    this.currentOrder = {
      name: menu['sku'],
      date: menu['createdAt'],
      inputs: menu['inputs'],
      total: menu['inputs'].map(el => el['cost'] * el['required']).reduce((a, b) => a + b, 0)
    }
  }

  approve(element) {
    const batch = this.af.firestore.batch();
    this.auth.user$.pipe(
      take(1)
    ).subscribe(user => {
      element['menu'].forEach(el => {
        let menuRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc();
        let menuData = {
          id: menuRef.id,
          name: el['dish']['name'], // Lomo Saltado
          sku: '',//AP102001
          description: '',
          picture: ' ',
          unit: 'UND.',// UND., KG., GR., L., M., PULG. ...
          stock: el['amount'],
          emergencyStock: 0,
          type: el['category']['value'], // ENTRADA, FONDO, POSTRE, PIQUEO, BEBIDA
          recipeId: el['dish']['recipeId'],
          status: 'DISPONIBLE', // DISPONIBLE, COCINANDO, INACTIVO
          price: 0,
          createdAt: new Date,
          createdBy: user,
          editedAt: new Date,
          editedBy: user,
        }

        batch.set(menuRef, menuData)
      })

      element['inputs'].forEach(el => {
        console.log(el['id']);
        
        let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/warehouseInputs/`).doc(el['id']);
        console.log(el['stock']);
        let data = {
          stock: el['stock'] - el['required']
        }
        batch.update(inputRef, data)
      })

      let orderRef = this.af.firestore.collection(`/db/deliciasTete/kitchenOrders`).doc(element['id']);

      batch.update(orderRef, {
        status: 'aprobado'
      })

      batch.commit().then(() => {
        console.log('aprobado');

      })
    })



  }

}

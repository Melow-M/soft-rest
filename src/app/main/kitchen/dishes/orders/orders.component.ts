import { element } from 'protractor';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { tap, filter, take, map } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable, combineLatest } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
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

  dishes$: Observable<any>
  dishes: Array<any>

  displayedOrderColumns: string[] = ['index', 'date', 'document', 'menu', 'inputs', 'user', 'actions'];
  dataOrderSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataOrderSource.paginator = paginator;
  }

  displayedMenuColumns: string[] = ['index', 'category', 'dish', 'prepared', 'sold'];
  dataMenuSource = new MatTableDataSource();

  displayedInputsColumns: string[] = ['index', 'input', 'unit', 'amount', 'cost', 'costTotal'];
  dataInputsSource = new MatTableDataSource();

  data_xls: any
  headersXlsx: string[] = [
    'Fecha',
    'Categoría',
    'Plato',
    'Cantidad Preparada',
    'Cantidad vendida'
  ]

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    public datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.orders$ =
      combineLatest(
        this.dbs.onGetKitchenOrders(),
        this.dbs.onGetDishes()
      )
        .pipe(
          map(([orders, dishes]) => {
            this.dishes = dishes
            let array = orders.map(order => {
              order['menu'] = order['menu'].map(menu => {
                let exist = false
                let sold = 0
                let dishId = ''
                dishes.forEach(dish => {
                  let sku = dish['sku'].split('-')[1]
                  if (sku == order['sku'].split('-')[1]) {
                    exist = true
                    menu['amount'] += dish['stock']
                    sold = menu['amount'] - dish['stock']
                    dishId = dish['id']
                    
                  }
                })
                return {
                  ...menu,
                  exist: exist,
                  sold: sold,
                  dishId: dishId
                }
              })
              return order
            })
            return array
          }),
          tap(res => {
            this.dataOrderSource.data = res
          })
        )

  }

  viewMenu(menu) {
    this.ordersView = false
    this.menuView = true
    this.data_xls = menu['menu']
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

  print() {
    const title = ['Nro', 'Insumo', 'Medida', 'Cantidad']

    let array = this.currentOrder['inputs'].map((el, index) => {
      return [String(index + 1), el['name'], el['unit'], String(el['required'])]
    })

    this.dbs.printAnything4Column(title, array)
  }

  downloadMenu() {
    let table_xlsx: any[] = [];

    table_xlsx.push(this.headersXlsx);

    this.data_xls.forEach(element => {
      const temp = [
        this.datePipe.transform(this.currentOrder['date'].toMillis(), 'dd/MM/yyyy'),
        element['category']['name'],
        element['dish']['name'],
        element['amount'],
        element['sold']
      ];
      table_xlsx.push(temp);
    })

    let date = this.datePipe.transform(this.currentOrder['date'].toMillis(), 'dd/MM/yyyy')
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Menú del día');

    const name = 'Menú_del_día' + date + '.xlsx'
    XLSX.writeFile(wb, name);
  }

  approve(element) {
    const batch = this.af.firestore.batch();
    this.auth.user$.pipe(
      take(1)
    ).subscribe(user => {
      element['menu'].forEach((el, index) => {
        if (el['exist']) {
          let menuRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc(el['dishId']);
          let menuDataUpdate = {
            stock: el['amount'],
            initialStock: el['amount'],
            type: el['category']['value'], // ENTRADA, FONDO, POSTRE, PIQUEO, BEBIDA
            recipeId: el['dish']['recipeId'],
            status: 'COCINANDO', // DISPONIBLE, COCINANDO, INACTIVO
            price: 0,
            editedAt: new Date,
            editedBy: user,
          }
          let costRef = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/${el['dishId']}/costTrend`).doc();
          let costData = {
            id: costRef.id,
            cost: el['cost'],
            price: 0,
            kitchenOrder: element['id'],
            createdAt: new Date()
          }

          batch.update(menuRef, menuDataUpdate)
          batch.set(costRef, costData)
        } else {
          let menuRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc();
          let menuData = {
            id: menuRef.id,
            name: el['dish']['name'], // Lomo Saltado
            sku: 'AP-' + element['sku'].split('-')[1] +'-'+ ('000' + (this.dishes.length+1)).slice(-3),//AP102001
            description: '',
            picture: ' ',
            unit: 'UND.',// UND., KG., GR., L., M., PULG. ...
            stock: el['amount'],
            initialStock: el['amount'],
            emergencyStock: 0,
            type: el['category']['value'], // ENTRADA, FONDO, POSTRE, PIQUEO, BEBIDA
            recipeId: el['dish']['recipeId'],
            status: 'COCINANDO', // DISPONIBLE, COCINANDO, INACTIVO
            price: 0,
            createdAt: new Date,
            createdBy: user,
            editedAt: new Date,
            editedBy: user,
          }
          let costRef = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/${menuRef.id}/costTrend`).doc();
          let costData = {
            id: costRef.id,
            cost: el['cost'],
            price: 0,
            kitchenOrder: element['id'],
            createdAt: new Date()
          }

          batch.set(menuRef, menuData)
          batch.set(costRef, costData)
        }



      })

      element['inputs'].forEach(el => {

        let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/warehouseInputs/`).doc(el['id']);

        let data = {
          stock: el['stock'] - el['required']
        }
        batch.update(inputRef, data)
        let kardexRef = this.af.firestore.collection(`/db/deliciasTete/warehouseInputs/${el['id']}/kardex`).doc(inputRef.id)

        let inputKardex = {
          id: inputRef.id,
          details: 'Preparación de menú, orden de cocina: ' + element['sku'],
          insQuantity: 0,
          insPrice: 0,
          insTotal: 0,
          outsQuantity: el['required'],
          outsPrice: el['cost'],
          outsTotal: el['required'] * el['cost'],
          balanceQuantity: 0,
          balancePrice: 0,
          balanceTotal: 0,
          type: 'SALIDA',
          createdAt: new Date(),
          createdBy: user
        }

        batch.set(kardexRef, inputKardex)
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

  cancelOrder(element){
    const batch = this.af.firestore.batch();

    let orderRef = this.af.firestore.collection(`/db/deliciasTete/kitchenOrders`).doc(element['id']);

      batch.update(orderRef, {
        status: 'cancelado'
      })

      batch.commit().then(() => {
        console.log('cancelado');

      })
    
  }

  publicOrder(element) {
    const batch = this.af.firestore.batch();
    this.auth.user$.pipe(
      take(1)
    ).subscribe(user => {
      element['menu'].forEach(el => {
        let menuRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc(el['dishId']);
        let menuDataUpdate = {
          status: 'DISPONIBLE', // DISPONIBLE, COCINANDO, INACTIVO
          editedAt: new Date,
          editedBy: user,
        }

        batch.update(menuRef, menuDataUpdate)
      })

      let orderRef = this.af.firestore.collection(`/db/deliciasTete/kitchenOrders`).doc(element['id']);

      batch.update(orderRef, {
        status: 'publicado'
      })

      batch.commit().then(() => {
        console.log('publicado');

      })
    })
  }



  finish(element) {
    const batch = this.af.firestore.batch();
    this.auth.user$.pipe(
      take(1)
    ).subscribe(user => {
      element['menu'].forEach(el => {
        let menuRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc(el['dishId']);
        let menuDataUpdate = {
          stock: 0,
          initialStock: 0,
          status: 'INACTIVO', // DISPONIBLE, COCINANDO, INACTIVO
          editedAt: new Date,
          editedBy: user,
        }

        batch.update(menuRef, menuDataUpdate)
      })

      let orderRef = this.af.firestore.collection(`/db/deliciasTete/kitchenOrders`).doc(element['id']);

      batch.update(orderRef, {
        status: 'finalizado'
      })

      batch.commit().then(() => {
        console.log('publicado');

      })
    })
  }

}

import { Meal } from './../../../../../core/models/sales/menu/meal.model';
import { take, tap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from './../../../../../core/auth.service';
import { DatabaseService } from './../../../../../core/database.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {

  inputs$: Observable<any>
  inputs: Array<any> = []

  approve: boolean = false

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore,
    private dialog: MatDialogRef<ApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.inputs$ = this.dbs.onGetElements('Insumos').pipe(
      tap(res => {
        this.inputs = res
        console.log(this.inputs);

      })
    )
  }

  verifiedInputs() {
    let verified = this.inputs.map(el => {
      let there = 0
      this.data['inputs'].forEach(al => {
        if (el['id'] == al['id']) {
          there = el['stock'] - al['required']
        }
      })
      return {
        ...el,
        required: there
      }
    })

    this.approve = verified.filter(el => el['required'] < 0).length == 0
    console.log(verified.filter(el => el['required'] < 0));
    
    console.log(this.approve);
    
  }

  save() {
    this.verifiedInputs()
    if (this.approve) {
      console.log('here');

      const batch = this.af.firestore.batch();
      this.auth.user$.pipe(
        take(1)
      ).subscribe(user => {
        this.data['menu'].forEach((el, index) => {
          let menuRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenDishes/`).doc();
          let menuData: Meal = {
            id: menuRef.id,
            name: el['dish']['name'], // Lomo Saltado
            sku: 'AP-' + this.data['sku'].split('-')[1] + '-' + ('00' + (index + 1)).slice(-3),//AP102001
            description: '',
            picture: ' ',
            unit: 'UND.',// UND., KG., GR., L., M., PULG. ...
            stock: el['amount'],
            initialStock: el['amount'],
            emergencyStock: 0,
            menuType: el['menuType'],
            type: el['category']['value'], // ENTRADA, FONDO, POSTRE, PIQUEO, BEBIDA
            recipeId: el['dish']['recipeId'],
            status: 'COCINANDO', // DISPONIBLE, COCINANDO, INACTIVO
            price: 0,
            cost: el['cost'],
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
            kitchenOrder: this.data['id'],
            createdAt: new Date()
          }

          batch.set(menuRef, menuData)
          batch.set(costRef, costData)

        })

        this.data['inputs'].forEach(el => {

          let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/warehouseInputs/`).doc(el['id']);

          let data = {
            stock: el['stock'] - el['required']
          }
          batch.update(inputRef, data)
          let kardexRef = this.af.firestore.collection(`/db/deliciasTete/warehouseInputs/${el['id']}/kardex`).doc(inputRef.id)

          let inputKardex = {
            id: inputRef.id,
            details: 'Preparación de menú, orden de cocina: ' + this.data['sku'],
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

        let orderRef = this.af.firestore.collection(`/db/deliciasTete/kitchenOrders`).doc(this.data['id']);

        batch.update(orderRef, {
          status: 'aprobado'
        })

        batch.commit().then(() => {
          console.log('aprobado');
          this.dialog.close()
        })
      })
    } else {
      console.log('error');

    }

  }
}

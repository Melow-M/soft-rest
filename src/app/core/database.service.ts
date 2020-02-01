import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/third-parties/customer.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';
import { Provider } from './models/third-parties/provider.model';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { KitchenInput } from 'src/app/core/models/warehouse/kitchenInput.model'
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CostTrend } from './models/warehouse/costTrend.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * THIRD PARTIES VARIBLES
   */

   customersCollection: AngularFirestoreCollection<Customer>;
   customers$: Observable<Customer[]>;

   providersCollection: AngularFirestoreCollection<Provider>;
   providers$: Observable<Provider[]>;


  constructor(
    public af: AngularFirestore
  ) { }

  /********* THIRD PARTIES METHODS ****************** */

  getCustomers(): Observable<Customer[]> {
    this.customersCollection = this.af.collection('db/deliciasTete/thirdPartiesCustomers', ref => ref.orderBy('createdAt', 'desc'));
    this.customers$ = this.customersCollection.valueChanges().pipe(shareReplay(1));
    return this.customers$;
  }

  getProviders(): Observable<Provider[]> {
    this.providersCollection = this.af.collection('db/deliciasTete/thirdPartiesProviders', ref => ref.orderBy('createdAt', 'desc'));
    this.providers$ = this.providersCollection.valueChanges().pipe(shareReplay(1));
    return this.providers$;
  }
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  //Warehouse

  //Warehouse-Stocktaking
  onGetUnits(): Observable<{ id: string, unit: string }[]> {
    return this.afs.collection<{ id: string, unit: string }>(`/db/deliciasTete/kitchenUnits`).valueChanges()
  }

  onGetInputs(): Observable<KitchenInput[]> {
    return this.afs.collection<KitchenInput>(`/db/deliciasTete/kitchenInputs/`).valueChanges()
  }

  onGetElements(types : string): Observable<KitchenInput[]>{
    let typ: string;

    switch (types) {
      case 'Insumos':
        typ= 'warehouseInputs';
        break;
      case 'Otros':
        typ= 'warehouseGrocery';
        break;
      case 'Postres':
        typ= 'warehouseDesserts';
        break;
      case 'Menajes':
        typ= 'warehouseTools';
        break;
    }

    return this.afs.collection<KitchenInput>(`/db/deliciasTete/${typ}/`).valueChanges()
  }

  onAddInput(input: KitchenInput, types: string, newUnit?: { id: string, unit: string }): Observable<firebase.firestore.WriteBatch> {
    let batch = this.afs.firestore.batch();
    let date = new Date()
    let typ: string;

    switch (types) {
      case 'Insumos':
        typ= 'warehouseInputs';
        break;
      case 'Otros':
        typ= 'warehouseGrocery';
        break;
      case 'Postres':
        typ= 'warehouseDesserts';
        break;
      case 'Menajes':
        typ= 'warehouseTools';
        break;
    }

    //Input
    let inputRef: DocumentReference = this.afs.firestore.collection(`/db/deliciasTete/${typ}/`).doc();
    let inputData: KitchenInput;

    //KitchenUnits
    let kitchenUnitsRef: DocumentReference = this.afs.firestore.collection(`/db/deliciasTete/kitchenUnits/`).doc();
    let kitchenUnitsData = {
      unit: input.unit,
      id: kitchenUnitsRef.id
    }

    //CostTrend
    let costTrendRef: DocumentReference = this.afs.firestore
      .collection(`/db/deliciasTete/${typ}/${inputRef.id}/costTrend`).doc();
    let costTrendData: CostTrend = {
      cost: input.cost,
      createdAt: date,
      id: costTrendRef.id
    }

    batch.set(costTrendRef, costTrendData);

    return this.auth.user$.pipe(
      take(1),
      map(user => {
        inputData = {
          id: inputRef.id,
          name: input.name,
          description: input.description,
          sku: input.sku,
          unit: newUnit == undefined ? input.unit : newUnit.unit,
          stock: input.stock,
          cost: input.cost,
          status: 'ACTIVO',
          createdAt: new Date(),
          createdBy: user,
          editedAt: new Date(),
          editedBy: user
        }

        batch.set(inputRef, inputData);

        //if it doesn't have Id, this unit doesnt exist, so we create it
        if (newUnit == undefined) {
          batch.set(kitchenUnitsRef, kitchenUnitsData)
        }

        return batch;
      })
    )
  }


}

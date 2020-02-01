import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/third-parties/customer.model';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { shareReplay, tap } from 'rxjs/operators';
import { Provider } from './models/third-parties/provider.model';

import { KitchenInput } from 'src/app/core/models/warehouse/kitchenInput.model'
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';
import { CostTrend } from './models/warehouse/costTrend.model';
import { Purchase } from './models/warehouse/purchase.model';

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
    public af: AngularFirestore,
    private auth: AuthService
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

  //Warehouse

  //Warehouse-Stocktaking
  onGetUnits(): Observable<{ id: string, unit: string }[]> {
    return this.af.collection<{ id: string, unit: string }>(`/db/deliciasTete/kitchenUnits`).valueChanges()
  }

  onGetInputs(): Observable<KitchenInput[]> {
    return this.af.collection<KitchenInput>(`/db/deliciasTete/kitchenInputs/`).valueChanges()
  }

  //To get available elements
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
        typ= 'warehouseHousehold';
        break;
    }

    return this.af.collection<KitchenInput>(`/db/deliciasTete/${typ}/`).valueChanges()
  }

  //To add a new element. We should change it to onAddInput
  onAddInput(input: KitchenInput, types: string, newUnit?: { id: string, unit: string }): Observable<firebase.firestore.WriteBatch> {
    let batch = this.af.firestore.batch();
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
        typ= 'warehouseHousehold';
        break;
    }

    //Input
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/${typ}/`).doc();
    let inputData: KitchenInput;

    //KitchenUnits
    let kitchenUnitsRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenUnits/`).doc();
    let kitchenUnitsData = {
      unit: input.unit,
      id: kitchenUnitsRef.id
    }

    //CostTrend
    let costTrendRef: DocumentReference = this.af.firestore
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
          editedBy: user,
          type: types,
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

  onAddPurchase(purchase: Purchase, itemsList: Array<{kitchenInputId: string; item: KitchenInput; quantity: number; cost: number;}>): 
    Observable<firebase.firestore.WriteBatch> {
    let purchaseRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/warehousePurchases/`).doc();
    let purchaseData: Purchase = purchase;
    let batch = this.af.firestore.batch()

    let costTrendRef: DocumentReference;
    let costTrendData: CostTrend
    let itemRef: DocumentReference;
    let types: string;
    let typ: string;

    let date = new Date();

    return this.auth.user$.pipe(
      take(1),
      map(user => {
        //purchaseDoc
        purchaseData.id = purchaseRef.id;
        purchaseData.itemsList = itemsList;

        purchaseData.createdAt = new Date();
        purchaseData.createdBy = user;
        purchaseData.editedAt = null;
        purchaseData.editedBy = null;
        purchaseData.approvedAt = null;
        purchaseData.approvedBy = null;

        purchaseData.status = 'GRABADO';

        batch.set(purchaseRef, purchaseData);

        //Cost trends
        itemsList.forEach(item => {
          if(item.cost != item.item.cost){
            switch (item.item.type) {
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

          itemRef = this.af.firestore.collection(`/db/deliciasTete/${typ}`).doc(item.kitchenInputId);
          
          costTrendRef = this.af.firestore.collection(`/db/deliciasTete/${typ}/${item.kitchenInputId}/costTrend`).doc();
          costTrendData = {
            cost: Math.round(item.cost * 100.0 / item.quantity*100.0) / 100.0,
            id: costTrendRef.id,
            createdAt: date
          };

          batch.update(itemRef, {cost: costTrendData.cost});
          batch.set(costTrendRef, costTrendData);
          }
        })

        return batch;
    }))
  }

  repPurchaseValidator(docType: string, serie: number, corr: number, provider: Provider){
    return this.af.collection<Purchase>(`/db/deliciasTete/warehousePurchases/`, ref => ref.where('documentDetails.provider.id', "==" , provider.id)).valueChanges()
      .pipe(map((purchase)=>{
        if(!purchase.length){
          return null
        }
        else{
          if(purchase.find(el => (el.documentDetails.documentCorrelative == Number(corr) && el.documentDetails.documentSerial == Number(serie) && el.documentDetails.documentType == docType))
              == undefined){
                return null
              }
          else{
            return {repeatedPurchase: true}
          }
        }
        
      }))
  }

  //Warehouse purchases
  onGetPurchases(startDate: Date, endDate: Date): Observable<Purchase[]>{
    let formattedendDate: number = Math.ceil(endDate.valueOf()/1000.0)
    return this.af.collection<Purchase>(`/db/deliciasTete/warehousePurchases/`, ref => ref.where('documentDetails.documentDate', '>=', startDate))
      .valueChanges().pipe(map(purchase => purchase.filter(el => el.documentDetails.documentDate['seconds']<=formattedendDate)),tap(console.log))
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/third-parties/customer.model';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { shareReplay, tap, combineLatest } from 'rxjs/operators';
import { Provider } from './models/third-parties/provider.model';
import { Payable } from './models/admin/payable.model';
import { Cash } from './models/sales/cash/cash.model';
import { User } from './models/general/user.model';

import { KitchenInput } from 'src/app/core/models/warehouse/kitchenInput.model'
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';
import { CostTrend } from './models/warehouse/costTrend.model';
import { Purchase } from './models/warehouse/purchase.model';
import { Household } from './models/warehouse/household.model';
import { Input } from './models/warehouse/input.model';
import { Dessert } from './models/warehouse/desserts.model';
import { Grocery } from './models/warehouse/grocery.model';
import { Recipe } from './models/kitchen/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * GENERAL VARIABLES
   */

  usersCollection: AngularFirestoreCollection<User>;
  users$: Observable<User[]>;

  /**
   * THIRD PARTIES VARIBLES
   */

  customersCollection: AngularFirestoreCollection<Customer>;
  customers$: Observable<Customer[]>;

  providersCollection: AngularFirestoreCollection<Provider>;
  providers$: Observable<Provider[]>;

  /**
   * ADMINISTRATIVE VARIABLES
   */

  payablesCollection: AngularFirestoreCollection<Payable>;
  payables$: Observable<Payable[]>;

  cashesCollection: AngularFirestoreCollection<Cash>;
  cashes$: Observable<Cash[]>;

  /**
   * WAREHOUSE VARIABLES
   */

   purchasesCollection: AngularFirestoreCollection<Payable>;
   purchases$: Observable<Payable[]>;

  constructor(
    public af: AngularFirestore,
    private auth: AuthService
  ) { }

  /********** GENERAL METHODS *********************** */

  getUsers(): Observable<User[]> {
    this.usersCollection = this.af.collection('users', ref => ref.orderBy('displayName', 'desc'));
    this.users$ = this.usersCollection.valueChanges().pipe(shareReplay(1));
    return this.users$;
  }

  getCurrentMonthOfViewDate(): { from: Date, to: Date } {
    const date = new Date();
    const fromMonth = date.getMonth();
    const fromYear = date.getFullYear();

    const actualFromDate = new Date(fromYear, fromMonth, 1);

    const toMonth = (fromMonth + 1) % 12;
    let toYear = fromYear;

    if (fromMonth + 1 >= 12) {
      toYear++;
    }

    const toDate = new Date(toYear, toMonth, 1);

    return { from: actualFromDate, to: toDate };
  }

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


  /********** ADMINISTRATIVE METHODS ***************** */

  getPayables(): Observable<Payable[]> {
    this.payablesCollection = this.af.collection('db/deliciasTete/accountsPayable', ref => ref.where('status', '==', 'PENDIENTE'));
    this.payables$ =
      this.payablesCollection.valueChanges()
        .pipe(
          map(res => {
            return res.sort((a, b) => b.documentDate.valueOf() - a.documentDate.valueOf());
          }),
          shareReplay(1));
    return this.payables$;
  }

  getCashes(): Observable<Cash[]> {
    this.cashesCollection = this.af.collection('db/deliciasTete/cashRegisters', ref => ref.orderBy('createdAt', 'desc'));
    this.cashes$ = this.cashesCollection.valueChanges().pipe(shareReplay(1));
    return this.cashes$;
  }

  /************ WAREHOUSE METHODS ********* */

  //Warehouse-Stocktaking
  onGetUnits(): Observable<{ id: string, unit: string }[]> {
    return this.af.collection<{ id: string, unit: string }>(`/db/deliciasTete/kitchenUnits`).valueChanges()
  }

  //To get available elements
  onGetElements(types: string): Observable<KitchenInput[]> {
    let typ: string;

    switch (types) {
      case 'Insumos':
        typ = 'warehouseInputs';
        break;
      case 'Otros':
        typ = 'warehouseGrocery';
        break;
      case 'Postres':
        typ = 'warehouseDesserts';
        break;
      case 'Menajes':
        typ = 'warehouseHousehold';
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
        typ = 'warehouseInputs';
        break;
      case 'Otros':
        typ = 'warehouseGrocery';
        break;
      case 'Postres':
        typ = 'warehouseDesserts';
        break;
      case 'Menajes':
        typ = 'warehouseHousehold';
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

  onAddPurchase(purchase: Purchase, itemsList: Array<{ kitchenInputId: string; item: KitchenInput; quantity: number; cost: number; }>):
    Observable<firebase.firestore.WriteBatch> {
    let purchaseRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/accountsPayable`).doc();
    let purchaseData: Purchase = purchase;
    let batch = this.af.firestore.batch()

    let payableData: Payable;

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

        //Se cambio el purchase model por el payable model. Se procede a combertir que cambiar aca
        //batch.set(purchaseRef, purchaseData);

        let temp = [];
        purchaseData.itemsList.forEach(el => {
          temp.push({
            id: el.item.id,
            type: el.item.type, //INSUMO, MENAJE, POSTRE, OTROS
            name: el.item.name,
            sku: el.item.sku,
            quantity: el.quantity,
            amount: el.cost,
            item: el.item
          });
        })

        payableData = {
          id: purchaseRef.id,
          documentDate: purchaseData.documentDetails.documentDate,          
          documentType: purchaseData.documentDetails.documentType, // FACTURA, BOLETA, TICKET
          documentSerial: purchaseData.documentDetails.documentSerial,
          documentCorrelative: purchaseData.documentDetails.documentCorrelative,
          provider: {
            id: purchaseData.documentDetails.provider.id,
            name: purchaseData.documentDetails.provider.name,
            ruc: purchaseData.documentDetails.provider.ruc,
          },
          
          payments: purchaseData.documentDetails.paymentType == 'CREDITO' ? [{//SOLO CREDITO
            type: 'PARCIAL',
            paymentType: purchaseData.documentDetails.paymentType,
            amount: purchaseData.imports.paidImport,
            cashReference: null,
            paidAt: date,
            paidBy: user,
          }]:[{
            type: 'TOTAL',
            paymentType: purchaseData.documentDetails.paymentType,
            amount: purchaseData.imports.totalImport,
            cashReference: null,
            paidAt: date,
            paidBy: user,
          }],

          itemsList: temp,
          
          creditDate: purchaseData.documentDetails.creditExpirationDate == undefined ? null:purchaseData.documentDetails.creditExpirationDate,
          paymentDate: null,
          totalAmount: purchaseData.imports.totalImport,
          subtotalAmount: purchaseData.imports.subtotalImport == undefined ? null: purchaseData.imports.subtotalImport,
          igvAmount: purchaseData.imports.igvImport == undefined ? null: purchaseData.imports.igvImport,
          paymentType: purchaseData.documentDetails.paymentType, // CREDITO, EFECTIVO, TARJETA
          paidAmount: purchaseData.documentDetails.paymentType == 'CREDITO' ?  purchaseData.imports.paidImport : purchaseData.imports.totalImport,
          indebtAmount: purchaseData.documentDetails.paymentType == 'CREDITO' ? purchaseData.imports.indebtImport: null, //no existe por credito
          status: purchaseData.documentDetails.paymentType == 'CREDITO' ? 'PENDIENTE': 'PAGADO', // PENDIENTE, PAGADO, ANULADO
          createdAt: date,
          createdBy: user,
          editedAt: null,
          editedBy: null,
          approvedAt: null,
          approvedBy: null,
        }

        batch.set(purchaseRef, payableData);

        //

        //Cost trends
        itemsList.forEach(item => {
          if (item.cost != item.item.cost) {
            switch (item.item.type) {
              case 'Insumos':
                typ = 'warehouseInputs';
                break;
              case 'Otros':
                typ = 'warehouseGrocery';
                break;
              case 'Postres':
                typ = 'warehouseDesserts';
                break;
              case 'Menajes':
                typ = 'warehouseHousehold';
                break;
            }

            itemRef = this.af.firestore.collection(`/db/deliciasTete/${typ}`).doc(item.kitchenInputId);

            costTrendRef = this.af.firestore.collection(`/db/deliciasTete/${typ}/${item.kitchenInputId}/costTrend`).doc();
            costTrendData = {
              cost: Math.round(item.cost * 100.0 / item.quantity * 100.0) / 100.0,
              id: costTrendRef.id,
              createdAt: date
            };

            batch.update(itemRef, { cost: costTrendData.cost });
            batch.set(costTrendRef, costTrendData);
          }
        })

        return batch;
      }))
  }

  repPurchaseValidator(docType: string, serie: string, corr: number, provider: Provider) {
    return this.af.collection<Payable>(`/db/deliciasTete/accountsPayable`, ref => ref.where('documentDetails.provider.id', "==", provider.id)).valueChanges()
      .pipe(map((purchase) => {
        if (!purchase.length) {
          return null
        }
        else {
          if (purchase.find(el => (el.documentCorrelative == Number(corr) && el.documentSerial == serie && el.documentType == docType))
            == undefined) {
            return null
          }
          else {
            return { repeatedPurchase: true }
          }
        }

      }))
  }

  //Warehouse purchases
  onGetPurchases(startDate: Date, endDate: Date): Observable<Payable[]> {
    this.purchasesCollection = this.af.collection<Payable>(`/db/deliciasTete/accountsPayable`, ref => ref.where('documentDate', '>=', startDate).where('documentDate', '<=', endDate))
    this.purchases$ = this.purchasesCollection.valueChanges().pipe(shareReplay(1));
    return this.purchases$
  }

  onGetInputs(): Observable<Input[]>{
    return this.af.collection<Input>(`/db/deliciasTete/warehouseInputs`, ref => ref.orderBy('name')).valueChanges();
  }

  //Kitchen
  onGetRecipes(): Observable<Recipe[]> {
    return this.af.collection<Recipe>(`/db/deliciasTete/kitchenRecipes`, ref => ref.orderBy('name')).valueChanges();
  }

  onGetRecipesType(category: string): Observable<Recipe[]>{
    console.log(category);
    return this.af.collection<Recipe>(`/db/deliciasTete/kitchenRecipes`, ref => ref.where('category', '==', category)).valueChanges()
  }

  onUploadRecipe(recipe: Recipe): Observable<firebase.firestore.WriteBatch>{
    let recipeRef = this.af.firestore.collection(`/db/deliciasTete/kitchenRecipes`).doc();
    let recipeData = recipe;
    let date = new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1), map((user)=> {
      recipeData.createdAt = date;
      recipeData.createdBy = user;
      recipeData.id = recipeRef.id;
      batch.set(recipeRef, recipeData);
      return batch;
    }));
  }

  // onGetRecipe()

}

import { Order } from './models/sales/menu/order.model';
import { Meal } from './models/sales/menu/meal.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
import { Input } from './models/warehouse/input.model';
import { Household } from './models/warehouse/household.model';
import { Grocery } from './models/warehouse/grocery.model';
import { Dessert } from './models/warehouse/desserts.model';
import { Kardex } from './models/warehouse/kardex.model';
import { Recipe } from './models/kitchen/recipe.model';
import * as jsPDF from 'jspdf';
import { Promo } from './models/sales/menu/promo.model';
import { Combo } from './models/sales/menu/combo.model';
import { Role } from './models/general/role.model';

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

  inputsCollection: AngularFirestoreCollection<Input>;
  inputs$: Observable<Input[]>;

  householdsCollection: AngularFirestoreCollection<Household>;
  households$: Observable<Household[]>;

  groceriesCollection: AngularFirestoreCollection<Grocery>;
  groceries$: Observable<Grocery[]>;

  dessertsCollection: AngularFirestoreCollection<Dessert>;
  desserts$: Observable<Dessert[]>;

  items$: Observable<(any)[]>;

  kardexCollection: AngularFirestoreCollection<Kardex>;
  kardex$: Observable<Kardex[]>;

  /**
  * SALES VARIABLES
  */
  othersCollection: AngularFirestoreCollection<Grocery>;
  others$: Observable<Grocery[]>;

  dishesCollection: AngularFirestoreCollection<Meal>;
  dishes$: Observable<Meal[]>;

  ordersCollection: AngularFirestoreCollection<Order>;
  orders$: Observable<Order[]>;


  // -------------------------- USERS --------------------------------------
  public permitsCollection: AngularFirestoreCollection<Role>;
  constructor(
    public af: AngularFirestore,
    private auth: AuthService
  ) {
      //SYSTEM
      this.getPermits();
      this.getUsers();
      this.getCustomers();

   }


  //PErmits
  permitsList$: Observable<Role[]>;



   // *************** USERS
  addUser(data): Promise<any> {
    return this.usersCollection.doc(data['uid']).set(data);
  }

  getPermits(): void {
    this.permitsCollection = this.af.collection<Role>(`/db/deliciasTete/roles`, ref => ref.orderBy('createdAt', 'asc'));
    this.permitsList$ =
      this.permitsCollection.valueChanges()
        .pipe(
          map(res => {
            res.forEach((element, index) => {
              element['index'] = index;
            })
            return res;
          }),
          shareReplay(1)
        );
  }

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

  onGetInputs(): Observable<Input[]> {
    return this.af.collection<Input>(`/db/deliciasTete/kitchenInputs/`).valueChanges()
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
  onAddInput(input: any, types: string, newUnit?: { id: string, unit: string }): Observable<firebase.firestore.WriteBatch> {
    let batch = this.af.firestore.batch();
    let date = new Date()
    let typ: string;

    let inputData: any = {
      id: null,
      name: input['name'],
      description: input['description'],
      sku: input['sku'],
      unit: newUnit == undefined ? input['unit'] : newUnit.unit,
      stock: input['stock'],
      emergencyStock: input['emergencyStock'],
      picture: '',
      status: 'ACTIVO',
      createdAt: new Date(),
      createdBy: null,
      editedAt: null,
      editedBy: null
    }

    switch (types) {
      case 'INSUMOS':
        typ = 'warehouseInputs';
        inputData['averageCost'] = input['cost'];
        break;
      case 'MENAJES':
        typ = 'warehouseHousehold';
        inputData['averageCost'] = input['cost'];
        break;
      case 'OTROS':
        typ = 'warehouseGrocery';
        inputData['averageCost'] = input['cost'];
        inputData['price'] = input['price'];
        break;
      case 'POSTRES':
        typ = 'warehouseDesserts';
        inputData['averageCost'] = input['cost'];
        inputData['price'] = input['price'];
        break;

    }


    //Input
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/${typ}/`).doc();

    //KitchenUnits
    let kitchenUnitsRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenUnits/`).doc();
    let kitchenUnitsData = {
      unit: input['unit'],
      id: kitchenUnitsRef.id
    }

    //CostTrend
    let costTrendRef: DocumentReference = this.af.firestore
      .collection(`/db/deliciasTete/${typ}/${inputRef.id}/costTrend`).doc();
    let costTrendData: CostTrend = {
      cost: input['cost'],
      createdAt: date,
      id: costTrendRef.id
    }

    batch.set(costTrendRef, costTrendData);

    return this.auth.user$.pipe(
      take(1),
      map(user => {

        inputData['createdBy'] = user;

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
          }] : [{
            type: 'TOTAL',
            paymentType: purchaseData.documentDetails.paymentType,
            amount: purchaseData.imports.totalImport,
            cashReference: null,
            paidAt: date,
            paidBy: user,
          }],

          itemsList: temp,

          creditDate: purchaseData.documentDetails.creditExpirationDate == undefined ? null : purchaseData.documentDetails.creditExpirationDate,
          paymentDate: null,
          totalAmount: purchaseData.imports.totalImport,
          subtotalAmount: purchaseData.imports.subtotalImport == undefined ? null : purchaseData.imports.subtotalImport,
          igvAmount: purchaseData.imports.igvImport == undefined ? null : purchaseData.imports.igvImport,
          paymentType: purchaseData.documentDetails.paymentType, // CREDITO, EFECTIVO, TARJETA
          paidAmount: purchaseData.documentDetails.paymentType == 'CREDITO' ? purchaseData.imports.paidImport : purchaseData.imports.totalImport,
          indebtAmount: purchaseData.documentDetails.paymentType == 'CREDITO' ? purchaseData.imports.indebtImport : null, //no existe por credito
          status: purchaseData.documentDetails.paymentType == 'CREDITO' ? 'PENDIENTE' : 'PAGADO', // PENDIENTE, PAGADO, ANULADO
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

  //Kitchen
  onGetRecipes(): Observable<Recipe[]> {
    return this.af.collection<Recipe>(`/db/deliciasTete/kitchenRecipes`, ref => ref.orderBy('name')).valueChanges();
  }

  onGetRecipesType(category: string): Observable<Recipe[]> {
    console.log(category);
    return this.af.collection<Recipe>(`/db/deliciasTete/kitchenRecipes`, ref => ref.where('category', '==', category)).valueChanges()
  }


  onUploadRecipe(recipe: Recipe): Observable<firebase.firestore.WriteBatch> {
    let recipeRef = this.af.firestore.collection(`/db/deliciasTete/kitchenRecipes`).doc();
    let recipeData = recipe;
    let date = new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1), map((user) => {
      recipeData.createdAt = date;
      recipeData.createdBy = user;
      recipeData.id = recipeRef.id;
      batch.set(recipeRef, recipeData);
      return batch;
    }));
  }

  onEditRecipe(recipe: Recipe): Observable<firebase.firestore.WriteBatch> {
    let recipeRef = this.af.firestore.collection(`/db/deliciasTete/kitchenRecipes`).doc(recipe.id);
    let recipeData = recipe;
    let date = new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1), map((user) => {
      recipeData.editedAt = date;
      recipeData.editedBy = user;
      console.log(recipeData);
      batch.update(recipeRef, recipeData);
      return batch;
    }));
  }

  onDeleteRecipe(recipe: Recipe): firebase.firestore.WriteBatch {
    let recipeRef = this.af.firestore.collection(`/db/deliciasTete/kitchenRecipes`).doc(recipe.id);
    let batch = this.af.firestore.batch();

    batch.delete(recipeRef);
    return batch;
  }


  // onGetRecipe(recipe: Recipe): Observable<firebase.firestore.WriteBatch>{}


  getItems(type: string): Observable<(any)[]> {
    switch (type) {
      case 'INSUMOS':
        this.inputsCollection = this.af.collection(`db/deliciasTete/warehouseInputs`, ref => ref.orderBy('createdAt', 'desc'));
        this.items$ = this.inputsCollection.valueChanges().pipe(shareReplay(1));
        return this.items$;
        break;

      case 'MENAJES':
        this.householdsCollection = this.af.collection(`db/deliciasTete/warehouseHousehold`, ref => ref.orderBy('createdAt', 'desc'));
        this.items$ = this.householdsCollection.valueChanges().pipe(shareReplay(1));
        return this.items$;
        break;

      case 'POSTRES':
        this.dessertsCollection = this.af.collection(`db/deliciasTete/warehouseDesserts`, ref => ref.orderBy('createdAt', 'desc'));
        this.items$ = this.dessertsCollection.valueChanges().pipe(shareReplay(1));
        return this.items$;
        break;

      case 'OTROS':
        this.groceriesCollection = this.af.collection(`db/deliciasTete/warehouseGrocery`, ref => ref.orderBy('createdAt', 'desc'));
        this.items$ = this.groceriesCollection.valueChanges().pipe(shareReplay(1));
        return this.items$;
        break;

      default:
        console.log('Sin resultados');
        break;
    }
  }

  getKardex(from: Date, to: Date, type: string, id: string): Observable<Kardex[]> {

    let typ;

    switch (type) {
      case 'INSUMOS':
        typ = 'warehouseInputs';
        break;
      case 'MENAJES':
        typ = 'warehouseHousehold';
        break;
      case 'OTROS':
        typ = 'warehouseGrocery';
        break;
      case 'POSTRES':
        typ = 'warehouseDesserts';
        break;
    }

    this.kardexCollection = this.af.collection(`db/deliciasTete/${typ}/${id}/kardex`, ref => ref.where('createdAt', '>=', from).where('createdAt', '<=', to));
    this.kardex$ =
      this.kardexCollection.valueChanges()
        .pipe(
          map(res => {
            return res.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
          }),
          shareReplay(1)
        );

    return this.kardex$;
  }

  /************ SALES METHODS ********* */

  onGetOthers(): Observable<Grocery[]> {
    this.othersCollection = this.af.collection('db/deliciasTete/warehouseGrocery', ref => ref.orderBy('createdAt', 'desc'));
    this.others$ = this.othersCollection.valueChanges().pipe(shareReplay(1));
    return this.others$;
  }
  onGetDishes() {

    this.dishesCollection = this.af.collection('db/deliciasTete/kitchenDishes', ref => ref.orderBy('createdAt', 'desc'));
    this.dishes$ = this.dishesCollection.valueChanges().pipe(shareReplay(1));
    return this.dishes$;
  }

  getOrders() {
    this.ordersCollection = this.af.collection('db/deliciasTete/orders', ref => ref.orderBy('createdAt', 'desc'));
    this.orders$ = this.ordersCollection.valueChanges().pipe(shareReplay(1));
    return this.orders$;
  }

  onGetOrders(from: Date, to: Date): Observable<Order[]> {
    this.ordersCollection = this.af.collection('db/deliciasTete/orders', ref => ref.where('createdAt', '>=', from).where('createdAt', '<=', to));
    this.orders$ =
      this.ordersCollection.valueChanges()
        .pipe(
          map(res => {
            return res.sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
          }),
          shareReplay(1)
        );
    return this.orders$;
  }

  getOpenCash(cash) {
    let openingCollection = this.af.collection('db/deliciasTete/cashRegisters/' + cash + '/openings', ref => ref.orderBy('openedAt', 'desc'));
    return openingCollection.valueChanges().pipe(shareReplay(1));
  }

  getTransactions(cashId, openingId) {
    let transactionsCollection = this.af.collection('db/deliciasTete/cashRegisters/' + cashId + '/openings/' + openingId + '/transactions', ref => ref.orderBy('createdAt', 'desc'));
    return transactionsCollection.valueChanges().pipe(shareReplay(1));
  }


  printTicket(elements: { quantity: number, description: string, vUnit: number, import: number }[], ticketNumber: string) {
    //Ejemplo: 
    // let elements = [{
    //   quantity: 2,
    //   description: 'ALMUERZO BASICO BASICOOOo',
    //   vUnit: 10.55,
    //   import: 20.39
    //   },{
    //   quantity: 1,
    //   description: 'Coca Cola 475 ml',
    //   vUnit: 3,
    //   import: 3
    //   }];

    // let ticketNumber = 'T001-000001';

    let total = elements.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.import;
    }, 0);

    var doc = new jsPDF({
        unit: 'pt',
        format: [414, 353+21*(elements.length-1)],
        orientation: 'l'
    });

    doc.setFontStyle("bold");
    doc.setFontSize(15),
    doc.text("TICKET", 207, 59, {
        align: "center",
        baseline: "middle"
      });

    doc.text(ticketNumber, 207, 82, {
      align: "center",
      baseline: "middle"
    });

    doc.text("DELICIAS TETE S.A.C. - 20603001304", 207, 122, {
      align: "center",
      baseline: "middle"
    });
    doc.setFontStyle('normal'),
      doc.text("Comedor SENATI", 207, 143, {
        align: "center",
        baseline: "middle"
    });
    
    doc.setFontSize(14),
    doc.line(22,168,392,168);
    doc.setFontStyle('bold');

    doc.text("Cant.", 39, 188, {
      align: "left",
      baseline: "bottom"
    });

    doc.text("Descrip.", 138, 188, {
      align: "left",
      baseline: "bottom"
    });

    doc.text("V Unit.", 268, 188, {
      align: "left",
      baseline: "bottom"
    });

    doc.text("Importe.", 331, 188, {
      align: "left",
      baseline: "bottom"
    });

    doc.line(22, 196, 392, 196);

    //Inside elements
    doc.setFontStyle('normal');

    for (let i = 0; i < elements.length; i++) {

      doc.setFontStyle('normal');
      doc.text(elements[i].quantity.toFixed(2), 70, 228 + 21 * i, {
        align: "right",
        baseline: "bottom"
      });

      doc.setFontStyle('bold');

      //Cutting text
      if (doc.getTextWidth(elements[i].description) >= 175) {
        //Cut description
        let descriptionSliced = "ERROR";
        for (let j = elements[i].description.length; j > 0; j--) {
          if (doc.getTextWidth(elements[i].description.slice(0, j)) < 175) {
            descriptionSliced = elements[i].description.slice(0, j);
            j = 0;
            doc.text(descriptionSliced, 88, 228 + 21 * i, {
              align: "left",
              baseline: "bottom",
            });
          };
        }
      }
      else {
        //Original description
        doc.text(elements[i].description, 88, 228 + 21 * i, {
          align: "left",
          baseline: "bottom",
        });

      }



      doc.setFontStyle('normal');
      doc.text(elements[i].vUnit.toFixed(2), 309, 228 + 21 * i, {
        align: "right",
        baseline: "bottom"
      });

      doc.text(elements[i].import.toFixed(2), 379, 228 + 21 * i, {
        align: "right",
        baseline: "bottom"
      });

      if (i == elements.length - 1) {
        doc.setFontStyle('bold');
        doc.text('TOTAL', 70, 278 + 21 * i, {
          align: "right",
          baseline: "bottom"
        });

        doc.text("S/.", 207, 278 + 21 * i, {
          align: "center",
          baseline: "bottom"
        });


        doc.text(total.toFixed(2), 379, 278 + 21 * i, {
          align: "right",
          baseline: "bottom"
        });

        doc.setFontStyle('normal');
        doc.text("----- Gracias por su preferencia -----", 207, 323 + 21 * i, {
          align: "center",
          baseline: "bottom"
        });

      }
    }

    doc.autoPrint({ variant: 'non-conform' });
    doc.save(`TICKET-${ticketNumber}.pdf`);
  }

  //Offer

  onGetProductType(type: string): Observable<Array<Grocery | Meal | Dessert>> {
    switch (type) {
      case 'Otros':
        return this.af.collection<Grocery>(`/db/deliciasTete/warehouseGrocery`).valueChanges();
        break;
      case 'Postres':
        return this.af.collection<Meal>(`/db/deliciasTete/warehouseDesserts`).valueChanges();
        break;
      case 'Platos':
        return this.af.collection<Dessert>(`/db/deliciasTete/kitchenDishes`).valueChanges();
        break;
    }
  }

  onCreateOffer(promo: Promo): Observable<firebase.firestore.WriteBatch> {
    let promoRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/offers`).doc();
    let promoData: Promo = promo;
    let date = new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1),
      map(user => {
        promoData.createdAt = date;
        promoData.createdBy = user;
        promoData.id = promoRef.id;
        promoData.editedAt = null;
        promoData.editedBy = null;

        batch.set(promoRef, promoData);

        return batch;
      }))
  }

  onGetOffer(): Observable<Promo[]> {
    return this.af.collection<Promo>(`/db/deliciasTete/offers`).valueChanges();
  }

  changeOfferState(promo: Promo, newState: string): Observable<firebase.firestore.WriteBatch> {
    let promoRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/offers`).doc(promo.id);
    let promoData: Promo = promo;
    let date = new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1),
      map(user => {
        promoData.editedAt = date;
        promoData.editedBy = user;
        promoData.state = newState == 'Activar' ? 'Publicado' : 'Inactivo';

        batch.update(promoRef, promoData);

        return batch;
      }))
  }

  onGetCombo(): Observable<Combo[]>{
    return this.af.collection<Combo>(`/db/deliciasTete/combos`).valueChanges();
  }

  onCreateCombo(combo: Combo): Observable<firebase.firestore.WriteBatch>{
    let comboRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/combos`).doc();
    let comboData: Combo = combo;
    let date= new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1),
      map(user => {
        comboData.createdAt = date;
        comboData.createdBy = user;
        comboData.id = comboRef.id;
        comboData.editedAt = null;
        comboData.editedBy = null;

        batch.set(comboRef, comboData);

        return batch;
      }))
  }
  changeComboState(combo: Combo, newState: string): Observable<firebase.firestore.WriteBatch>{
    let comboRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/combos`).doc(combo.id);
    let comboData: Combo = combo;
    let date= new Date();
    let batch = this.af.firestore.batch();

    return this.auth.user$.pipe(take(1),
      map(user => {
        comboData.editedAt = date;
        comboData.editedBy = user;
        comboData.state = newState == 'Activar' ? 'Publicado':'Inactivo';

        batch.update(comboRef, comboData);

        return batch;
      }))
  }

  //Kitchen
  getOrdersKitchen(from: Date, to: Date): Observable<Order[]> {

    let orderRef= this.af.collection<Order>(`db/deliciasTete/orders`, ref => ref.where('createdAt', '>=', from).where('createdAt', '<=', to));
    
    return orderRef.valueChanges();
  }
}

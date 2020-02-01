import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/third-parties/customer.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';
import { Provider } from './models/third-parties/provider.model';
import { Payable } from './models/admin/payable.model';
import { Cash } from './models/sales/cash/cash.model';
import { User } from './models/general/user.model';

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

  constructor(
    public af: AngularFirestore
  ) { }
  /********** GENERAL METHODS *********************** */
  
  getUsers(): Observable<User[]>{
    this.usersCollection = this.af.collection('users', ref => ref.orderBy('displayName', 'desc'));
    this.users$ = this.usersCollection.valueChanges().pipe(shareReplay(1));
    return this.users$;
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


  /**********ADMINISTRATIVE METHODS ***************** */

  getPayables(): Observable<Payable[]> {
    this.payablesCollection = this.af.collection('db/deliciasTete/accountsPayable', ref => ref.orderBy('createdAt', 'desc'));
    this.payables$ = this.payablesCollection.valueChanges().pipe(shareReplay(1));
    return this.payables$;
  }

  getCashes(): Observable<Cash[]> {
    this.cashesCollection = this.af.collection('db/deliciasTete/cashRegisters', ref => ref.orderBy('createdAt', 'desc'));
    this.cashes$ = this.cashesCollection.valueChanges().pipe(shareReplay(1));
    return this.cashes$;
  }
}

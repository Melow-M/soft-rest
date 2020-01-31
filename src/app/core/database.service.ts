import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/third-parties/customer.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';
import { Provider } from './models/third-parties/provider.model';

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
}

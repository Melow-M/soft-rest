import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './models/third-parties/customer.model';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * THIRD PARTIES VARIBLES
   */

   customersCollection: AngularFirestoreCollection<Customer>;
   customers$: Observable<Customer[]>;


  constructor(
    public af: AngularFirestore
  ) { }

  /********* THIRD PARTIES METHODS ****************** */

  getCustomers(): Observable<Customer[]> {
    this.customersCollection = this.af.collection('db/deliciasTete/thirdPartiesCustomers', ref => ref.orderBy('createdAt', 'desc'));
    this.customers$ = this.customersCollection.valueChanges().pipe(shareReplay(1));
    return this.customers$;
  }
}

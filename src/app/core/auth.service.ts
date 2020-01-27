import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
//import { User } from './user';

import { MatSnackBar } from '@angular/material';
import { Platform } from '@angular/cdk/platform';
import { switchMap, map, tap, shareReplay, filter } from 'rxjs/operators';
//import { UserAndPermits } from "./models/userandpermits.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public permitsDocument: AngularFirestoreDocument<any>;
  public permits$: Observable<any>;

  //user$: Observable<User>;
  //userAndPermits$: Observable<UserAndPermits>;
  notifications$: Observable<any>; // FALTA MODEL
  tasks$: Observable<any>;

  authLoader: boolean = false;

  // actionsGetUser = new BehaviorSubject<boolean>(true);
  // getUser$ = this.actionsGetUser.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public snackbar: MatSnackBar,
    public platform: Platform
  ) {

    // this.user$ =
    //   this.afAuth.authState.pipe(
    //     switchMap(user => {
    //       if (user) {
    //         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //       } else {
    //         return of(null);
    //       }
    //     })
    //   );

    // this.permits$ =
    //   this.user$.pipe(
    //     filter(user => user !== null),
    //     switchMap(user => {
    //       return this.afs.doc(`db/systemConfigurations/permits/${user.permit.id}`).valueChanges();
    //     })
    //   );

    // this.notifications$ =
    //   this.user$.pipe(
    //     filter(user => user !== null),
    //       switchMap(user => {
    //         return this.afs.collection(`users/${user.uid}/notifications`).valueChanges();
    //       })
    //   )

    //   this.tasks$ =
    //   this.user$.pipe(
    //     filter(user => user !== null),
    //       switchMap(user => {
    //         return this.afs.collection(`users/${user.uid}/tasks`).valueChanges();
    //       })
    //   )

    // this.userAndPermits$ = combineLatest(
    //   this.user$,
    //   this.permits$
    // ).pipe(
    //   map(([user, permits]) => {
    //     return { ...user, permits: permits }
    //   }),
    //   shareReplay(1)
    // );
  }

  // ********* EMAIL LOGIN

  emailLogin(email: string, password: string) {
    this.authLoader = true;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        if (credential) {
          this.authLoader = false;
          this.router.navigateByUrl('/main');
        }
      })
      .catch(error => {
        this.handleError(error)});
  }

  // ******** SIGN OUT

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  // ********** ERROR HANDLING

  private handleError(error) {
    console.log(error.code)
    let message = '';

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Error: El formato del correo es incorrecto';
        break;

      case 'auth/wrong-password':
        message = 'Error: El password es incorrecto o el usuario no tiene un password';
        break;

      case 'auth/user-disabled':
        message = 'Error: El usuario esta deshabilitado';
        break;

      case 'auth/user-not-found':
        message = 'Error: El usuario no está registrado';
        break;

      default:
        message = 'Hmmm esto es nuevo ...' + error.code;
        break;
    }
    this.snackbar.open(message, 'Cerrar', {
      duration: 6000,
    });

    this.authLoader = false;
  }
}
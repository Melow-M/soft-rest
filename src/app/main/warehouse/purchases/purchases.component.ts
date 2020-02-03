import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { RegisterDocumentsComponent } from './register-documents/register-documents.component';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { Provider } from 'src/app/core/models/third-parties/provider.model';
import { tap, startWith, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Payable } from 'src/app/core/models/admin/payable.model';
import { AuthService } from 'src/app/core/auth.service';
import { PurchasesShowItemsDialogComponent } from './purchases-show-items-dialog/purchases-show-items-dialog.component';
import { PurchasesShowPaymentsDialogComponent } from './purchases-show-payments-dialog/purchases-show-payments-dialog.component';
import { PurchasesCancelDialogComponent } from './purchases-cancel-dialog/purchases-cancel-dialog.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PurchasesComponent implements OnInit {

  loadingPayables = new BehaviorSubject<boolean>(false);
  loadingPayables$ = this.loadingPayables.asObservable();
  
  loadingProviders = new BehaviorSubject<boolean>(false);
  loadingProviders$ = this.loadingProviders.asObservable();

  dataFormGroup: FormGroup;

  displayedColumns: string[] = ['index', 'createdAt', 'documentDate', 'documentType', 'documentSerial', 'documentCorrelative', 'provider', 'itemsList', 'subtotalAmount', 'igvAmount', 'totalAmount', 'paymentType', 'status', 'creditDate', 'paymentDate', 'paidAmount', 'indebtAmount', 'payments', 'createdBy', 'editedBy', 'actions'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  currentDate = Date.now();
  
  dateAndPayables$: Observable<Payable[]>;
  payables$: Observable<Payable[]>;
  providers$: Observable<Provider[]>;


  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { 
    
  }

  ngOnInit() {

    this.createForm();

    const view = this.dbs.getCurrentMonthOfViewDate();
    // this.dataFormGroup.get('date').setValue({begin: view.from, end: new Date()});

    this.dateAndPayables$ =
      this.dataFormGroup.get('date').valueChanges
        .pipe(
          startWith<any>({begin: view.from, end: new Date()}),
          debounceTime(300),
          switchMap(date => {
            return this.observePayables(date.begin, date.end);
          })
        );

    this.payables$ =
      combineLatest(
        this.dateAndPayables$,
        this.dataFormGroup.get('provider').valueChanges.pipe(startWith<any>(''))
      ).pipe(
        map(([payables, provider]) => {

          const filterKey = provider ? provider.ruc : '';

          const list = payables.filter(option =>
            option.provider.ruc === filterKey
          );

          if(provider === ''){
            this.dataSource.data = payables;
            return payables;
          } else {
            this.dataSource.data = list;
            return list;
          }

          
        })
      )

    this.providers$ = this.observeProviders();

  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      date: [{begin: new Date(), end: new Date()}],
      provider: [null]
    })
  }

  observePayables(from: Date, to: Date): Observable<Payable[]> {
    this.loadingPayables.next(true);

    return this.dbs.onGetPurchases(from, to)
      .pipe(
        tap(res => {
          this.loadingPayables.next(false);
        })
      )
  }

  observeProviders(): Observable<Provider[]> {
    this.loadingProviders.next(true);

    return this.dbs.getProviders()
      .pipe(
        tap(() => {
          this.loadingProviders.next(false);
        })
      )
  }

  onRegistering(){
    this.dialog.open(RegisterDocumentsComponent);
  }

  showItemsList(purchase: Payable): void {
    this.dialog.open(PurchasesShowItemsDialogComponent, {
      data: {
        purchase: purchase
      }
    });
  }

  showPayments(purchase: Payable): void {
    this.dialog.open(PurchasesShowPaymentsDialogComponent, {
      data: {
        purchase: purchase
      }
    });
  }

  cancelPurchase(purchase: Payable): void {
    this.dialog.open(PurchasesCancelDialogComponent), {
      data: {
        purchase: purchase
      }
    }
  }
}

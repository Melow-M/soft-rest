import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { startWith, debounceTime, switchMap, tap } from 'rxjs/operators';
import { Kardex } from 'src/app/core/models/warehouse/kardex.model';

@Component({
  selector: 'app-stocktaking-kardex-dialog',
  templateUrl: './stocktaking-kardex-dialog.component.html',
  styles: []
})
export class StocktakingKardexDialogComponent implements OnInit {

  loadingKardex = new BehaviorSubject<boolean>(false);
  loadingKardex$ = this.loadingKardex.asObservable();

  dateFormControl = new FormControl({begin: new Date(), end: new Date()});
  kardexTypeFormControl = new FormControl(true);

  displayedColumns: string[] = ['index', 'createdAt', 'details', 'insQuantity', 'insPrice', 'insTotal', 'outsQuantity', 'outsPrice', 'outsTotal', 'balanceQuantity', 'balancePrice', 'balanceTotal'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  currentDate = Date.now();
  
  dateAndKardex$: Observable<Kardex[]>;
  kardex$: Observable<Kardex[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, type: string, id: string }
  ) { }

  ngOnInit() {

    const view = this.dbs.getCurrentMonthOfViewDate();
    // this.dataFormGroup.get('date').setValue({begin: view.from, end: new Date()});

    this.dateAndKardex$ =
      this.dateFormControl.valueChanges
        .pipe(
          startWith<any>({begin: view.from, end: new Date()}),
          debounceTime(300),
          switchMap(date => {
            return this.observeKardex(date.begin, date.end);
          })
        );
  }

  observeKardex(from: Date, to: Date): Observable<Kardex[]> {
    this.loadingKardex.next(true);

    return this.dbs.getKardex(from, to, this.data.type, this.data.id)
      .pipe(
        tap(kardex => {
          this.loadingKardex.next(false);
          this.dataSource.data = [...kardex];
        })
      )
  }

}

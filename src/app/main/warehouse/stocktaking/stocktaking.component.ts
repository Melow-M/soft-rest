import { Component, OnInit, ViewChild, Provider } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { Household } from 'src/app/core/models/warehouse/household.model';
import { Grocery } from 'src/app/core/models/warehouse/grocery.model';
import { Dessert } from 'src/app/core/models/warehouse/desserts.model';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { startWith, debounceTime, switchMap, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { Payable } from 'src/app/core/models/admin/payable.model';

@Component({
  selector: 'app-stocktaking',
  templateUrl: './stocktaking.component.html',
  styleUrls: ['./stocktaking.component.css']
})
export class StocktakingComponent implements OnInit {

  loadingItems = new BehaviorSubject<boolean>(false);
  loadingItems$ = this.loadingItems.asObservable();

  itemsTypeFormControl = new FormControl('INSUMO');
  itemFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'name', 'sku', 'unit', 'stock', 'cost', 'totalCost', 'description', 'actions'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  items$: Observable<(any)[]>;
  typeAndItems$: Observable<(any)[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    this.typeAndItems$ =
      this.itemsTypeFormControl.valueChanges
        .pipe(
          startWith<any>('INSUMO'),
          debounceTime(300),
          switchMap(type => {
            return this.observeItems(type);
          })
        );

    this.items$ =
      combineLatest(
        this.typeAndItems$,
        this.itemFormControl.valueChanges.pipe(startWith<any>(''), debounceTime(300), distinctUntilChanged())
      ).pipe(
        map(([items, filterKey]) => {
          const key = filterKey.toLowerCase();

          const list = items.filter(option =>
            option.name.toLowerCase().includes(key) ||
            option.sku.toLowerCase().includes(key)
          );

          this.dataSource.data = key ? list : items;

          return this.dataSource.data;
        })
      )
  }

  observeItems(type: string): Observable<(any)[]> {
    this.loadingItems.next(true);

    return this.dbs.getItems(type)
      .pipe(
        tap(res => {
          this.loadingItems.next(false);
        })
      )
  }

}

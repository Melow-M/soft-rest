import { Component, OnInit, ViewChild, Provider } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { startWith, debounceTime, switchMap, map, tap, distinctUntilChanged, take } from 'rxjs/operators';
import { Household } from 'src/app/core/models/warehouse/household.model';
import { CreateInputDialogComponent } from './create-input-dialog/create-input-dialog.component';
import { StocktakingEditDialogComponent } from './stocktaking-edit-dialog/stocktaking-edit-dialog.component';
import { StocktakingDeleteConfirmComponent } from './stocktaking-delete-confirm/stocktaking-delete-confirm.component';

@Component({
  selector: 'app-stocktaking',
  templateUrl: './stocktaking.component.html',
  styleUrls: ['./stocktaking.component.css']
})
export class StocktakingComponent implements OnInit {

  loadingItems = new BehaviorSubject<boolean>(false);
  loadingItems$ = this.loadingItems.asObservable();

  itemsTypeFormControl = new FormControl('INSUMOS');
  itemFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'picture', 'name', 'sku', 'unit', 'stock', 'averageCost', 'price', 'totalValue', 'utility', 'description', 'createdBy', 'editedBy', 'actions'];

  dataSource = new MatTableDataSource();

  defaultImage = "../../../../assets/images/default-image.jpg";

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  itemsTypes: Array<string> = [
    'INSUMOS',
    'MENAJES',
    'POSTRES',
    'OTROS'
  ];

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
          startWith<any>('INSUMOS'),
          debounceTime(300),
          tap(type => {
            if (type === 'INSUMOS' || type === 'MENAJES') {
              this.displayedColumns = ['index', 'picture', 'name', 'sku', 'unit', 'stock', 'averageCost', 'totalValue', 'description', 'createdBy', 'editedBy', 'actions'];
            } else if (type === 'POSTRES' || type === 'OTROS') {
              this.displayedColumns = ['index', 'picture', 'name', 'sku', 'unit', 'stock', 'averageCost', 'price', 'totalValue', 'utility', 'description', 'createdBy', 'editedBy', 'actions'];
            }
          }),
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

  createItem(): void {
    this.dialog.open(CreateInputDialogComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe(type => {
        if (type) {
          this.itemsTypeFormControl.setValue(type);
        }

      })
  }

  withdrawHousehold(item: Household): void {
    //
  }

  addHousehold(item: Household): void {
    //
  }

  kardex(item: any): void {
    //
  }

  edit(item: any): void {
    this.dialog.open(StocktakingEditDialogComponent, {
      data: {
        item: item,
        type: this.itemsTypeFormControl.value
      }
    });
  }

  delete(item: any): void {
    this.dialog.open(StocktakingDeleteConfirmComponent, {
      data: {
        id: item['id'],
        name: item['name'],
        type: this.itemsTypeFormControl.value
      }
    });
  }

}

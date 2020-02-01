import { Component, OnInit, ViewChild } from '@angular/core';
import { Cash } from 'src/app/core/models/sales/cash/cash.model';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { AuthService } from 'src/app/core/auth.service';
import { startWith, debounceTime, distinctUntilChanged, map, filter, tap } from 'rxjs/operators';
import { ManageCashCreateDialogComponent } from './manage-cash-create-dialog/manage-cash-create-dialog.component';
import { ManageCashEditDialogComponent } from './manage-cash-edit-dialog/manage-cash-edit-dialog.component';
import { Customer } from 'src/app/core/models/third-parties/customer.model';
import { ManageCashDeleteConfirmComponent } from './manage-cash-delete-confirm/manage-cash-delete-confirm.component';

@Component({
  selector: 'app-manage-cash',
  templateUrl: './manage-cash.component.html',
  styles: []
})
export class ManageCashComponent implements OnInit {

  loadingCashes = new BehaviorSubject(false);
  loadingCashes$ = this.loadingCashes.asObservable();

  filterFormControl = new FormControl();

  displayedColumns: string[] = ['index', 'open', 'currentOwner', 'name', 'supervisor', 'password', 'lastOpening', 'lastClosure', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  cashes$: Observable<Cash[]>;

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.cashes$ =
      combineLatest(
        this.observeCashes(),
        this.filterFormControl.valueChanges.pipe(startWith<any>(''), debounceTime(300), distinctUntilChanged())
      ).pipe(
        map(([cashes, filterKey]) => {
          const list = cashes.filter(option => option.name.toLowerCase().includes(filterKey));

          const filteredList = list;
          this.dataSource.data = filteredList;

          return filteredList;
        })
      )
  }

  observeCashes(): Observable<Cash[]> {
    this.loadingCashes.next(true);

    return this.dbs.getCashes()
      .pipe(
        tap(res => {
          this.loadingCashes.next(false);
        })
      )
  }

  createCash(): void {
    this.dialog.open(ManageCashCreateDialogComponent);
  }

  editCash(cash: Cash): void {
    this.dialog.open(ManageCashEditDialogComponent, {
      data: {
        cash: cash
      }
    });
  }

  deleteCash(cash: Cash): void {
    this.dialog.open(ManageCashDeleteConfirmComponent, {
      data: {
        cash: cash
      }
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { CreateNewPromoDialogComponent } from './create-new-promo-dialog/create-new-promo-dialog.component';
import { Observable } from 'rxjs';
import { Promo } from 'src/app/core/models/sales/menu/promo.model';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css']
})
export class PromosComponent implements OnInit {
  //Table
  promosTableDataSource= new MatTableDataSource();

  promosTableDisplayedColumns: string[] = [
    'index', 'createdAt', 'name', 'recipesRecipe', 'state', 'dateRange', 'realPrice', 'promoPrice', 'disccount',
    'units', 'soldUnits', 'createdBy', 'actions'
  ]

  promoData$: Observable<Promo[]>;

  filterControl: FormControl = new FormControl()

  //Paginator
  constructor(
    private dialog: MatDialog,
    private dbs: DatabaseService,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('promoTablePaginator', {static: false}) set matPaginator(mp: MatPaginator){
    this.promosTableDataSource.paginator = mp;
  }
  
  ngOnInit() {
    this.promoData$ = this.dbs.onGetOffer().pipe(
      tap(offerList => {
        console.log(offerList);
        this.promosTableDataSource.data = offerList;
      }));
  }

  onCreateNewPromo(){
    this.dialog.open(CreateNewPromoDialogComponent, {
      width: '550px',
    })
  }

  filter(){
    this.promosTableDataSource.filter = this.filterControl.value;
  }

  formatDate(date: {seconds: number, nanoseconds: number}){
    let t = new Date(1970);
    t.setSeconds(date.seconds);
    return t;
  }

  changeOfferState(promo: Promo, newState: string){
    this.dbs.changeOfferState(promo, newState).subscribe(batch => {
      batch.commit().then(()=> {
        this.snackBar.open('Se cambió el estado satisfactoriamente', 'Aceptar');
      }).catch((err)=> {
        console.log(err);
        this.snackBar.open('No se pudo cambiar el estado. Intentelo nuevamente', 'Aceptar');
      })
    })

  }
}

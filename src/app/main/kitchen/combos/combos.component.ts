import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { Combo } from 'src/app/core/models/sales/menu/combo.model';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { tap } from 'rxjs/operators';
import { CreateNewComboDialogComponent } from './create-new-combo-dialog/create-new-combo-dialog.component';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.component.html',
  styleUrls: ['./combos.component.css']
})
export class CombosComponent implements OnInit {
  //Table
  combosTableDataSource= new MatTableDataSource();

  combosTableDisplayedColumns: string[] = [
    'index', 'createdAt', 'name', 'recipesRecipe', 'state', 'dateRange', 'price',
    'soldUnits', 'createdBy', 'actions'
  ]

  comboData$: Observable<Combo[]>;

  filterControl: FormControl = new FormControl()

  //Paginator
  constructor(
    private dialog: MatDialog,
    private dbs: DatabaseService,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('comboTablePaginator', {static: false}) set matPaginator(mp: MatPaginator){
    this.combosTableDataSource.paginator = mp;
  }
  
  ngOnInit() {
    this.comboData$ = this.dbs.onGetCombo().pipe(
      tap(offerList => {
        console.log(offerList);
        this.combosTableDataSource.data = offerList;
        console.log(this.combosTableDataSource.data);
      }));
  }

  onCreateNewCombo(){
    this.dialog.open(CreateNewComboDialogComponent, {
      width: '550px',
    })
  }

  filter(){
    this.combosTableDataSource.filter = this.filterControl.value;
  }

  formatDate(date: {seconds: number, nanoseconds: number}){
    let t = new Date(1970);
    t.setSeconds(date.seconds);
    return t;
  }

  changeComboState(combo: Combo, newState: string){
    this.dbs.changeComboState(combo, newState).subscribe(batch => {
      batch.commit().then(()=> {
        this.snackBar.open('Se cambió el estado satisfactoriamente', 'Aceptar');
      }).catch((err)=> {
        console.log(err);
        this.snackBar.open('No se pudo cambiar el estado. Intentelo nuevamente', 'Aceptar');
      })
    })

  }
}

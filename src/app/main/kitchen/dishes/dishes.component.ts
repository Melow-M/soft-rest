import { MissingInputsComponent } from './missing-inputs/missing-inputs.component';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { startWith, distinctUntilChanged, debounceTime, map, filter } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {

  menuTypes = [
    {
      name: 'Menú Ejecutivo',
      value: 'executive'
    },
    {
      name: 'Menú Básico',
      value: 'simple'
    },
    {
      name: 'Segundo',
      value: 'second'
    }
  ]

  categories = {
    executive:[
      {
        name: 'Entrada',
        value: 'ENTRADA'
      },
      {
        name: 'Sopas',
        value: 'ENTRADA'
      },
      {
        name: 'Segundo',
        value: 'FONDO'
      },
      {
        name: 'Postre',
        value: 'POSTRE'
      }
    ],
    simple:[
      {
        name: 'Entrada',
        value: 'ENTRADA'
      },
      {
        name: 'Sopas',
        value: 'ENTRADA'
      },
      {
        name: 'Segundo',
        value: 'FONDO'
      }
    ]
  }

  selectMenu:any = null

  listDishes$: Observable<any>
  menuForm: FormGroup

  displayedColumns: string[] = ['index', 'category', 'dish', 'amount', 'supplies', 'actions'];
  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  menuList: Array<any> = []

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.menuForm = this.fb.group({
      category: ['', Validators.required],
      dish: ['', Validators.required],
      amount: ['', Validators.required]
    })

    this.listDishes$ = combineLatest(
      this.dbs.onGetDishes(),
      this.menuForm.get('category').valueChanges.pipe(
        startWith('')
      ),
      this.menuForm.get('dish').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([dishes, category, dish]) => {
        let dishesC = dishes.filter(el => category ? el['type'] == category['value'] : false)
        return dish ? dishesC.filter(option => option['name'].toLowerCase().includes(dish.toLowerCase())) : dishesC;
      })
    )

    this.dataSource.data = this.menuList
  }

  showDish(dish): string | undefined {
    return dish ? dish['name'] : undefined;
  }

  add() {
    this.menuList.push(this.menuForm.value)
    this.dataSource.data = this.menuList

    this.menuForm.reset()

  }

  missingInputs(){
    console.log('open');
    
    this.dialog.open(MissingInputsComponent)
  }
}

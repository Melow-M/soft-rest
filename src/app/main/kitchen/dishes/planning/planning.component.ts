import { MissingInputsComponent } from './../missing-inputs/missing-inputs.component';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { startWith, distinctUntilChanged, debounceTime, map, filter } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

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
    executive: [
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
    simple: [
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

  selectMenu: any = null

  listDishes$: Observable<any>
  menuForm: FormGroup

  displayedColumns: string[] = ['index', 'category', 'dish', 'amount', 'supplies', 'actions'];
  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  menuList: Array<any> = []
  inputs: Array<any> = null
  inputsRequired: Array<any> = null

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
      this.dbs.onGetRecipes(),
      this.menuForm.get('dish').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())),
      this.dbs.onGetElements('Insumos')
    ).pipe(
      map(([dishes, dish, inputs]) => {
        this.inputs = inputs

        return dish ? dishes.filter(option => option['name'].toLowerCase().includes(dish.toLowerCase())) : dishes;
      })
    )
    this.dataSource.data = this.menuList
  }

  showDish(dish): string | undefined {
    return dish ? dish['name'] : undefined;
  }

  add() {

    this.menuList.push(this.menuForm.value)

    let inputsRequired = this.menuList.map(el => {
      return el['dish']['inputs'].map(al => {
        return {
          ...al,
          required: al['quantity'] * el['amount']
        }
      })

    }).reduce((a, b) => a.concat(b), [])

    this.inputsRequired = this.inputs.map(el => {
      let amount = 0
      let missing = 0
      inputsRequired.forEach(al => {
        if (el['id'] == al['id']) {
          amount += al['required']
          missing = el['stock'] - amount
        }
      })
      return {
        ...el,
        required: amount,
        missing: missing
      }
    }).filter(el => el['required'] > 0)

    this.menuList = this.menuList.map(el => {
      return {
        ...el,
        missing: this.inputsRequired.filter(al => al['missing'] < 0).length > 0
      }
    })
    this.dataSource.data = this.menuList
    this.menuForm.reset()

  }

  missingInputs() {
    console.log('open');

    this.dialog.open(MissingInputsComponent)
  }

  save() {
    console.log(this.inputsRequired);


  }
}

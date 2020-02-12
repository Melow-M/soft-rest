import { AuthService } from './../../../../core/auth.service';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { MissingInputsComponent } from './../missing-inputs/missing-inputs.component';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { startWith, distinctUntilChanged, debounceTime, map, filter, tap, take } from 'rxjs/operators';
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
  selectMenu$: Observable<any>

  listDishes$: Observable<any>
  menuForm: FormGroup
  selectMenuForm = new FormControl('')


  displayedColumns: string[] = ['index', 'category', 'dish', 'amount', 'supplies', 'actions'];
  dataSource = new MatTableDataSource();


  menuList: Array<any> = []
  inputs: Array<any> = null
  inputsRequired: Array<any> = null

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    public auth: AuthService,
    private af: AngularFirestore
  ) { }

  ngOnInit() {
    this.menuForm = this.fb.group({
      category: ['', Validators.required],
      dish: ['', Validators.required],
      amount: ['', Validators.required]
    })

    this.selectMenu$ = this.selectMenuForm.valueChanges.pipe(
      tap(res => {
        this.selectMenu = res
        this.dataSource.data = this.menuList.filter(el => el['menuType'] == this.selectMenu.value)
        if (res['value'] == 'second') {
          this.menuForm.get('category').setValue(this.categories['simple'][2])
        }
      })
    )

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

  }

  showDish(dish): string | undefined {
    return dish ? dish['name'] : undefined;
  }

  deleteItem(i) {
    console.log('what');

    this.menuList.splice(i, 1);
    this.dataSource.data = this.menuList.filter(el => el['menuType'] == this.selectMenu.value)
  }

  add() {

    this.menuList.push({
      ...this.menuForm.value,
      missing: true,
      menuType: this.selectMenu.value
    })

    let required = this.menuList.map(el => {
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
      required.forEach(al => {
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

    this.menuList[this.menuList.length - 1]['missing'] = this.inputsRequired.filter(al => al['missing'] < 0).length > 0
    this.dataSource.data = this.menuList.filter(el => el['menuType'] == this.selectMenu.value)
    this.menuForm.reset()

  }

  missingInputs() {
    this.dialog.open(MissingInputsComponent)
  }

  save() {

    const batch = this.af.firestore.batch();
    let inputRef: DocumentReference = this.af.firestore.collection(`/db/deliciasTete/kitchenOrders/`).doc();

    let menuL = this.menuList.map(el => {
      return {
        category: el['category'],
        dish: {
          name: el['dish']['name'],
          recipeId: el['dish']['id']
        },
        amount: el['amount'],
        menuType: el['menuType']
      }
    })

    console.log(menuL);


    let inputsR = this.inputsRequired.map(el => {
      return {
        cost: el['averageCost'],
        name: el['name'],
        unit: 'KG',
        id: el['id'],
        required: el['required'],
        stock: el['stock']
      }
    })

    console.log(inputsR);

    this.auth.user$.pipe(
      take(1))
      .subscribe(user => {
        let inputData = {
          id: inputRef.id,
          sku: 'ORC-0001',
          menu: menuL,
          inputs: inputsR,
          status: 'en proceso',
          createdAt: new Date(),
          createdBy: user,
          editedAt: new Date(),
          editedBy: user
        }


        batch.set(inputRef, inputData);


        batch.commit().then(() => {
          console.log('orden guardada');
          this.menuList = []
          this.dataSource.data = this.menuList
          this.selectMenuForm.reset()
          this.selectMenu = null
        })
      })
  }
}

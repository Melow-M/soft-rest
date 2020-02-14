import { filter, startWith, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../../../core/auth.service';
import { DatabaseService } from 'src/app/core/database.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  otherForm: FormGroup

  categories = ['Bebidas', 'Piqueos', 'Extras']

  displayedColumns: string[] = ['index', 'category', 'dish', 'amount', 'actions'];
  dataSource = new MatTableDataSource();

  listDishes$: Observable<any>

  menuList: Array<any> = []

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    public auth: AuthService,
    private af: AngularFirestore
  ) { }

  ngOnInit() {
    this.otherForm = this.fb.group({
      category: ['', Validators.required],
      dish: ['', Validators.required],
      amount: ['', Validators.required]
    })

    this.listDishes$ = combineLatest(
      this.dbs.onGetRecipes(),
      this.otherForm.get('category').valueChanges,
      this.otherForm.get('dish').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([dishes, category,dish]) => {
        let dishC = dishes.filter(el => el['category'] == category)
        return dish ? dishC.filter(option => option['name'].toLowerCase().includes(dish.toLowerCase())) : dishC;
      })
    )
  }

  showDish(dish): string | undefined {
    return dish ? dish['name'] : undefined;
  }

  deleteItem(i) {
    this.menuList.splice(i, 1);
    this.dataSource.data = this.menuList
  }
  editItem(element, index) {
    this.otherForm.get('dish').setValue(element['dish'])
    this.otherForm.get('category').setValue(element['category'])
    this.otherForm.get('amount').setValue(element['amount'])

    this.menuList.splice(index, 1);
    this.dataSource.data = this.menuList
  }

  add() {
    this.menuList.push(this.otherForm.value)


    this.otherForm.reset()
    this.otherForm.get('dish').setValue('')
  }

  cancel(){

  }

  save(){

  }
}

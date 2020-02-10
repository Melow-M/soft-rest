import { Component, OnInit, ChangeDetectionStrategy, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Dessert } from 'src/app/core/models/warehouse/desserts.model';
import { Observable, combineLatest } from 'rxjs';
import { Grocery } from 'src/app/core/models/warehouse/grocery.model';
import { Household } from 'src/app/core/models/warehouse/household.model';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { Tool } from 'src/app/core/models/warehouse/tools.model';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith, tap, debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Recipe } from 'src/app/core/models/kitchen/recipe.model';

@Component({
  selector: 'app-create-new-promo-dialog',
  templateUrl: './create-new-promo-dialog.component.html',
  styleUrls: ['./create-new-promo-dialog.component.css']
})
export class CreateNewPromoDialogComponent implements OnInit {
  //Table
  inputTableDataSource = new MatTableDataSource();
  inputTableDisplayedColumns: string[] = [
    'index', 'itemName', 'itemUnit', 'quantity', 'actions'
  ]
  @ViewChild('inputTablePaginator', {static:false}) inputTablePaginator: MatPaginator;
  
  //Variables
  productCategory: Array<string> = [
    'Platos', 'Piqueo', 'Extras', 'Bebidas'
  ]

  quantity: Array<string> = [
    'Indefinido', 'Definido'
  ]

  period: Array<string> = [
    'Indefinido', 'Definido'
  ]

  productNameFormat$: Observable<any>;

  promoForm: FormGroup;
  itemForm: FormGroup;

  inputList: Observable<string | Input[]>;

  constructor(
    private fb: FormBuilder,
    private dbs: DatabaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForms();
    this.inputList = combineLatest(this.dbs.onGetInputs(), this.itemForm.get('item').valueChanges)
      .pipe(map(([inputList, inputForm])=> this.onFilterInputs(inputList, inputForm)),
            startWith(''));
    this.inputTableDataSource.data = [];
    
  }

  deb(event){
    console.log(event);
  }

  initForms(){
    this.promoForm = this.fb.group({
      promoName: [null, Validators.required],
      quantity: [null, Validators.required],
      units: [ {value: null, disabled: true}, Validators.required],
      promoPrice: [null, Validators.required],
      realPrice: [null, Validators.required],
      percentageDiscount: [{value: null, disabled: true}, Validators.required],
      validityPeriod: [null, Validators.required],
      dateRange: [{begin: new Date(), end: new Date(), disabled: true}, Validators.required],
    })

    this.itemForm = this.fb.group({
      item: [null, Validators.required],
      quantity: [null, Validators.required]
    })

  }

  onFilterInputs(inputList: Input[], inputForm: string | Input){
    if(typeof inputForm != 'string'){
      return inputList.filter(input => input.name.toLowerCase().includes(inputForm.name.toLowerCase()))
    }
    else{
      const filterValue = inputForm.toLowerCase();
      return inputList.filter(input => input.name.toLowerCase().includes(filterValue))
    }
  }


  displayFn(input: Input) {
    if (!input) return '';
    return input.name.split('')[0].toUpperCase() + input.name.split('').slice(1).join('').toLowerCase();
  }

  onAddItem(){
    let table = this.inputTableDataSource.data;
    table.push({...this.itemForm.value, index: this.inputTableDataSource.data.length});
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
  }

  onDeleteItem(item){
    let table = this.inputTableDataSource.data;
    table.splice(item.index, 1);
    table.forEach((el, index) => {el['index'] = index})
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
    console.log(item);
  }

  onUploadRecipe(){
  }

  formatInput(value: string){
    let aux = value;
    let regex = new RegExp(/\s+/, 'ig');
    if(aux != null && aux !=""){
      aux = aux.replace(regex, ' ').toLowerCase().trim();
      return aux.split('')[0].toUpperCase() + aux.split('').slice(1).join('');
    }
    else return value;
  }

  repeatedNameValidator(dbs: DatabaseService){
    return(control: AbstractControl): Observable<ValidationErrors|null> => {
      return dbs.onGetRecipes().pipe(
        //debounceTime(800),
        take(1),
        map( res => {
          console.log('trying');
          if(!!res.find(recipe => recipe.name.toUpperCase() == this.formatInput(control.value).toUpperCase())){
            return {repeatedName: true}
          }
          else{
            return null;
          }
        }
        )
      )
    }
  }

}



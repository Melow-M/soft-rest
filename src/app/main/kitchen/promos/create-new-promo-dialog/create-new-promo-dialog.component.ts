import { Component, OnInit, ChangeDetectionStrategy, ViewChild, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Dessert } from 'src/app/core/models/warehouse/desserts.model';
import { Observable, combineLatest } from 'rxjs';
import { Grocery } from 'src/app/core/models/warehouse/grocery.model';
import { Household } from 'src/app/core/models/warehouse/household.model';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { Tool } from 'src/app/core/models/warehouse/tools.model';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith, tap, debounceTime, distinctUntilChanged, take, switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Recipe } from 'src/app/core/models/kitchen/recipe.model';
import { Promo } from 'src/app/core/models/sales/menu/promo.model';

@Component({
  selector: 'app-create-new-promo-dialog',
  templateUrl: './create-new-promo-dialog.component.html',
  styleUrls: ['./create-new-promo-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  recipeList$: Observable<Recipe[]>;

  constructor(
    private fb: FormBuilder,
    private dbs: DatabaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForms();
    // this.inputList$= combineLatest(this.dbs.onGetInputs(), this.itemForm.get('item').valueChanges)
    //   .pipe(map(([inputList, inputForm])=> this.onFilterInputs(inputList, inputForm)),
    //         startWith(''));
    this.inputTableDataSource.data = [];

    this.recipeList$ = this.itemForm.get('recipe').valueChanges.pipe(
      //First tap to initialize table data
      /*tap((productName: Recipe | string)=>{
        if(typeof productName=='string'){
          this.inputTableDataSource.data = [];
        }
        else{
          this.inputTableDataSource.data = productName.inputs;
        }
      }),*/
      //switchMap to get filtered data of options available
      switchMap((productName)=> {
        return this.dbs.onGetRecipesType(this.itemForm.get('productCategory').value).pipe(
          debounceTime(100), 
          map((recipesList: Recipe[])=> {
            console.log(recipesList);
            return this.filterRecipe(recipesList, this.itemForm.get('recipe').value)
          }))
      }));
    
  }

  deb(event){
    console.log(event);
  }

  initForms(){
    this.promoForm = this.fb.group({
      name: [null, Validators.required],
      quantity: [null, Validators.required],
      units: [ {value: null, disabled: true}, Validators.required],
      promoPrice: [null, Validators.required],
      realPrice: [null, Validators.required],
      percentageDiscount: [{value: null, disabled: true}, Validators.required],
      validityPeriod: [null, Validators.required],
      dateRange: [{begin: new Date(), end: new Date()}, Validators.required],
    })

    this.promoForm.get('dateRange').disable();

    this.itemForm = this.fb.group({
      productCategory: [null, Validators.required],
      recipe: [null, Validators.required],
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

  onAddItem(){
    let table = this.inputTableDataSource.data;
    console.log(this.itemForm.value);
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

  onUploadOffer(){
    let aux: {recipe: Recipe, quantity: number}[] = [];
    this.inputTableDataSource.data.forEach(el => {
      aux.push({
        quantity: el['quantity'],
        recipe: el['recipe']
      })
    });
    
    let recipe: Promo;
    recipe = {
      name: <string>this.promoForm.get('name').value,
      quantity: <string>this.promoForm.get('quantity').value, //Indefinido, Definido
      units: this.promoForm.get('quantity').value == 'Definido' ? <number>this.promoForm.get('units').value: null,
      promoPrice: <number>this.promoForm.get('promoPrice').value,
      realPrice: <number>this.promoForm.get('realPrice').value,
      validityPeriod: <string>this.promoForm.get('validityPeriod').value, //Indefinido, Definido
      dateRange: this.promoForm.get('validityPeriod').value == 'Definido' ? <{begin: Date, end: Date}>this.promoForm.get('dateRange').value: null,
      recipes: aux,
      state: 'Publicado',
      soldUnits: 0
    }

    this.dbs.onCreateOffer(recipe).subscribe(batch => {
      batch.commit().then(() => {
        this.snackBar.open('Se almacenó la oferta satisfactoriamente!', 'Aceptar');
      })
      .catch((err)=> {
        console.log(err);
        this.snackBar.open('No se pudo guardar la oferta. Por favor, vuelva a intentarlo.', 'Aceptar');
      })
    })

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

  filterRecipe(recipeList: Recipe[], recipeName: Recipe | string){
    if(typeof recipeName != 'string'){
      return recipeList.filter(recipe => recipe.name.toUpperCase().includes(recipeName.name.toUpperCase()))
    }
    else{
      return recipeList.filter(recipe => recipe.name.toUpperCase().includes(recipeName.toUpperCase()))
    }
  }

  displayFn(input: Input) {
    if (!input) return '';
    return input.name.split('')[0].toUpperCase() + input.name.split('').slice(1).join('').toLowerCase();
  }

}



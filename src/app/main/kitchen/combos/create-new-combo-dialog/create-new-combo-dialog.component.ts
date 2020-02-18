import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Grocery } from 'src/app/core/models/warehouse/grocery.model';
import { Meal } from 'src/app/core/models/sales/menu/meal.model';
import { Dessert } from 'src/app/core/models/warehouse/desserts.model';
import { DatabaseService } from 'src/app/core/database.service';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { Combo } from 'src/app/core/models/sales/menu/combo.model';

@Component({
  selector: 'app-create-new-combo-dialog',
  templateUrl: './create-new-combo-dialog.component.html',
  styleUrls: ['./create-new-combo-dialog.component.css']
})
export class CreateNewComboDialogComponent implements OnInit {

  //Table
  inputTableDataSource = new MatTableDataSource();
  inputTableDisplayedColumns: string[] = [
    'index', 'itemName', 'itemUnit', 'quantity', 'actions'
  ]
  @ViewChild('inputTablePaginator', {static:false}) inputTablePaginator: MatPaginator;
  
  //Variables
  productCategory: Array<string> = [
    'Platos', 'Postres', 'Otros'
  ]

  quantity: Array<string> = [
    'Indefinido', 'Definido'
  ]

  period: Array<string> = [
    'Indefinido', 'Definido'
  ]

  productNameFormat$: Observable<any>;

  comboForm: FormGroup;
  itemForm: FormGroup;

  productList$: Observable<Array<Grocery | Meal | Dessert>>;

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

    this.productList$ = this.itemForm.get('product').valueChanges.pipe(
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
        return this.dbs.onGetProductType(this.itemForm.get('productCategory').value).pipe(
          debounceTime(100), 
          map((productList)=> {
            console.log(productList);
            return this.filterRecipe(productList, this.itemForm.get('product').value)
          }))
      }));
    
  }

  deb(event){
    console.log(event);
  }

  initForms(){
    this.comboForm = this.fb.group({
      name: [null, Validators.required],
      price: [0, Validators.required],
      realPrice: [{value: 0, disabled: true}, Validators.required],
      percentageDiscount: [{value: 0, disabled: true}, Validators.required],
      validityPeriod: [null, Validators.required],
      dateRange: [{begin: new Date(), end: new Date()}, Validators.required],
    })

    this.comboForm.get('dateRange').disable();

    this.itemForm = this.fb.group({
      productCategory: [null, Validators.required],
      product: [null, Validators.required],
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

  async onAddItem(){
    let table = this.inputTableDataSource.data;
    let aux = null;
    if(this.itemForm.value['product'].hasOwnProperty('price')){
      table.push({
        ...this.itemForm.value, 
        index: this.inputTableDataSource.data.length
      });
    }
    else{
      aux = await this.dbs.calculateRecipeCost(this.itemForm.value['product']).toPromise();
      this.itemForm.value['product']['price'] = aux;
      table.push({
        ...this.itemForm.value, 
        index: this.inputTableDataSource.data.length,
      });
      
    }
    
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
    this.itemForm.get('product').setValue(''); this.itemForm.get('quantity').setValue('')
  }

  onDeleteItem(item){
    let table = this.inputTableDataSource.data;
    table.splice(item.index, 1);
    table.forEach((el, index) => {el['index'] = index})
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
    console.log(item);
  }



  onUploadCombo(){
    let aux: {product: Grocery | Meal | Dessert, quantity: number}[] = [];
    this.inputTableDataSource.data.forEach(el => {
      aux.push({
        quantity: el['quantity'],
        product: el['product']
      })
    });
    
    let recipe: Combo;
    recipe = {
      name: <string>this.comboForm.get('name').value,
      price: <number>this.comboForm.get('price').value,
      realPrice: <number>this.getTotal(),
      validityPeriod: <string>this.comboForm.get('validityPeriod').value, //Indefinido, Definido
      dateRange: this.comboForm.get('validityPeriod').value == 'Definido' ? <{begin: Date, end: Date}>this.comboForm.get('dateRange').value: null,
      products: aux,
      state: 'Publicado',
      soldUnits: 0
    }

    this.dbs.onCreateCombo(recipe).subscribe(batch => {
      batch.commit().then(() => {
        this.snackBar.open('Se almacenó el combo satisfactoriamente!', 'Aceptar');
      })
      .catch((err)=> {
        console.log(err);
        this.snackBar.open('No se pudo guardar el combo. Por favor, vuelva a intentarlo.', 'Aceptar');
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

  filterRecipe(recipeList: Array<Grocery | Meal | Dessert>, recipeName: Grocery | Meal | Dessert | string){
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

  getTotal(): number{
    if(this.inputTableDataSource.data.length){
      return this.inputTableDataSource.data.reduce<number>((acc, curr)=> {
        return <number>acc + <number>(curr['product']['price']*curr['quantity'])
      }, 0);

    }
    return 0
  }

  getTotalPrice(){
    return (this.getTotal()).toFixed(2)
  }

  getPercentage(){
    if(!this.comboForm.get('price').value || !this.getTotal()){
      return 0;
    }
    return ((this.getTotal()-this.comboForm.get('price').value)*100/this.getTotal()).toFixed(2)
  }
}



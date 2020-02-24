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
import { Recipe, InputRecipe, InputRecipeTable } from 'src/app/core/models/kitchen/recipe.model';

@Component({
  selector: 'app-create-new-recipe-dialog',
  templateUrl: './create-new-recipe-dialog.component.html',
  styleUrls: ['./create-new-recipe-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNewRecipeDialogComponent implements OnInit {
  //Table
  inputTableDataSource = new MatTableDataSource<InputRecipeTable>();
  inputTableDisplayedColumns: string[] = [
    'index', 'itemName', 'itemUnit', 'quantity', 'averageCost', 'totalCost', 'actions'
  ]
  @ViewChild('inputTablePaginator', {static:false}) inputTablePaginator: MatPaginator;
  
  //Variables
  productCategory: Array<string> = [
    'Platos', 'Piqueo', 'Extras', 'Bebidas'
  ]

  productNameFormat$: Observable<any>;

  productForm: FormGroup;
  itemForm: FormGroup;

  inputList: Observable<string | Input[]>;

  itemObservable$: Observable<number[]>;
  itemList: InputRecipe[] = [];

  unit:string = 'KG'
  constructor(
    private fb: FormBuilder,
    private dbs: DatabaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForms();
    this.inputList = combineLatest(this.dbs.onGetInputs(), this.itemForm.get('item').valueChanges.pipe(startWith('')))
      .pipe(map(([inputList, inputForm])=> this.onFilterInputs(inputList, inputForm)));
    this.inputTableDataSource.data = [];
  }

  //Form
  initForms(){
    this.productForm = this.fb.group({
      productCategory: [null, Validators.required],
      productName: [null, {
        validators: Validators.required, 
        asyncValidators: [this.repeatedNameValidator(this.dbs)],
        updateOn: 'blur'
      }],
      price: [{value: 0, disabled: false}, Validators.required],
      realPrice: [{value: 0, disabled: true}],
      percentageDiscount: [{value: 0, disabled: true}]
    })

    this.itemForm = this.fb.group({
      item: [null, [Validators.required, this.dbs.notObjectValidator]],
      quantity: [null, Validators.required]
    })

    this.productNameFormat$ = this.productForm.get('productName').valueChanges
    .pipe(
      startWith<any>(''),
      debounceTime(500),
      distinctUntilChanged(),
      tap((name: string) => {
      console.log('now');
      this.productForm.get('productName').setValue(this.formatInput(name));
      }));

  }

  onFilterInputs(inputList: Input[], inputForm: string | Input){
    if(inputForm == null){
      return inputList;
    }
    else{
      if(typeof inputForm != 'string'){
        return inputList.filter(input => input.name.toLowerCase().includes(inputForm.name.toLowerCase()))
      }
      else{
        const filterValue = inputForm.toLowerCase();
        return inputList.filter(input => input.name.toLowerCase().includes(filterValue))
      }
    }

  }

  displayFn(input: Input) {
    if (!input) return '';
    return input.name.split('')[0].toUpperCase() + input.name.split('').slice(1).join('').toLowerCase();
  }

  //Adding items
  onAddItem(){
    let aux: InputRecipeTable[] = [];
    this.itemList.push({
      name: (<Input>this.itemForm.get('item').value).name,
      sku: (<Input>this.itemForm.get('item').value).sku,
      quantity: <number>this.itemForm.get('quantity').value,
      id: (<Input>this.itemForm.get('item').value).id,
      unit: (<Input>this.itemForm.get('item').value).unit,
      type: 'INSUMOS',
    });
    
    this.itemObservable$ = this.dbs.gettingTotalRealCost(this.itemList).pipe(tap(res => {
      this.itemList.forEach((itemRecipe, index) => {
          aux.push(
            {
              ...itemRecipe,
              index: index,
              averageCost: res[index]/itemRecipe.quantity
            }
          )
      });
      this.inputTableDataSource.data = aux;
      this.inputTableDataSource.paginator = this.inputTablePaginator;
      this.itemForm.reset();
    }));
  }

  onDeleteItem(item: InputRecipeTable){
    let aux: InputRecipeTable[] = [];

    this.itemList.splice(item.index, 1);

    this.itemObservable$ = this.dbs.gettingTotalRealCost(this.itemList).pipe(tap(res => {
      this.itemList.forEach((itemRecipe, index) => {
          aux.push(
            {
              ...itemRecipe,
              index: index,
              averageCost: res[index]/itemRecipe.quantity
            }
          )
      });
      this.inputTableDataSource.data = aux;
      this.inputTableDataSource.paginator = this.inputTablePaginator;
      this.itemForm.reset();
    }));
  }

  getCostoTotal(): number{
    if(this.inputTableDataSource.data.length){
      return this.inputTableDataSource.data.reduce((acc, curr)=> {
        return acc + (curr.averageCost*curr.quantity)
      }, 0);
    }
    return 0
  }

  getPercentage(){
    if(!this.productForm.get('price').value || !this.getCostoTotal()){
      return 0;
    }
    return ((this.getCostoTotal()-this.productForm.get('price').value)*100/this.getCostoTotal())
  }


  onUploadRecipe(){
    let recipe: Recipe = {
      id: null,
      name: this.productForm.get('productName').value.toUpperCase(),
      sku: 'Aún no se',
      description: null,
      picture: null,
      category: this.productForm.get('productCategory').value,
      inputs: [],
      createdAt: null,
      createdBy: null,
      editedAt: null,
      editedBy: null,
      price: this.productForm.get('price').value,
    };

    this.inputTableDataSource.data.forEach(el => {
      recipe.inputs.push({
        name: el.name,
        sku: el.sku,
        quantity: el.quantity,
        id: el.id,        
        unit: el.unit,
        type: el.type
      });
    });

    console.log(recipe);
    this.dbs.onUploadRecipe(recipe).pipe(tap((batch)=> {
      batch.commit().then(()=> {
        this.snackBar.open('La receta fue guardada satisfactoriamente', 'Aceptar');
      })
      .catch((err)=> {
        console.log(err);
        this.snackBar.open('Ocurrió un error, por favor, vuelva a subir la receta', 'Aceptar')
      })
    })).subscribe();

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

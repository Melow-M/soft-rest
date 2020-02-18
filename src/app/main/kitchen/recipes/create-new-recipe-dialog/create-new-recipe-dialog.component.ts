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
  selector: 'app-create-new-recipe-dialog',
  templateUrl: './create-new-recipe-dialog.component.html',
  styleUrls: ['./create-new-recipe-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNewRecipeDialogComponent implements OnInit {
  //Table
  inputTableDataSource = new MatTableDataSource();
  inputTableDisplayedColumns: string[] = [
    'index', 'itemName', 'itemUnit', 'quantity', 'cost', 'actions'
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

  initForms(){
    this.productForm = this.fb.group({
      productCategory: [null, Validators.required],
      productName: [null, {
        validators: Validators.required, 
        asyncValidators: [this.repeatedNameValidator(this.dbs)],
        updateOn: 'blur'
      }]
    })

    this.itemForm = this.fb.group({
      item: [null, Validators.required],
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

  onAddItem(){
    let table = this.inputTableDataSource.data;
    table.push({...this.itemForm.value, index: this.inputTableDataSource.data.length});
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
    this.itemForm.reset();
  }

  onDeleteItem(item, index){
    let table = this.inputTableDataSource.data;
    table.splice(index, 1);
    table.forEach((el, index) => {el['index'] = index})
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
    console.log(item);
  }

  onUploadRecipe(){
    console.log(this.inputTableDataSource.data);
  }
  onUploadRecipe2(){
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
    };

    this.inputTableDataSource.data.forEach(el => {
      recipe.inputs.push({
        name: el['item']['name'],
        sku: el['item']['sku'],
        quantity: el['quantity'],
        id: el['item']['id'],
        unit: el['item']['unit']
      });
    });

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

  getCostoTotal(){
    return this.inputTableDataSource.data.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue['item']['cost']*currentValue['quantity']),0)
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

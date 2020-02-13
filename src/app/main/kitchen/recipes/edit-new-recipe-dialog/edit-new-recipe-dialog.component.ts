import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Dessert } from 'src/app/core/models/warehouse/desserts.model';
import { Observable, combineLatest } from 'rxjs';
import { Grocery } from 'src/app/core/models/warehouse/grocery.model';
import { Household } from 'src/app/core/models/warehouse/household.model';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { Tool } from 'src/app/core/models/warehouse/tools.model';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith, tap, debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Recipe } from 'src/app/core/models/kitchen/recipe.model';

@Component({
  selector: 'app-edit-new-recipe-dialog',
  templateUrl: './edit-new-recipe-dialog.component.html',
  styleUrls: ['./edit-new-recipe-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditNewRecipeDialogComponent implements OnInit {
  //Table
  inputTableDataSource = new MatTableDataSource();
  inputTableDisplayedColumns: string[] = [
    'index', 'itemName', 'itemUnit', 'quantity', 'actions'
  ]
  @ViewChild('inputTablePaginator', {static:true}) inputTablePaginator: MatPaginator;
  
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
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditNewRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Recipe
  ) { }

  ngOnInit() {
    this.initForms();
    this.initTableData();
    this.inputList = combineLatest(this.dbs.onGetInputs(), this.itemForm.get('item').valueChanges)
      .pipe(map(([inputList, inputForm])=> this.onFilterInputs(inputList, inputForm)),
            startWith(''));
    
  }

  initTableData(){
    let aux= [];
    this.data.inputs.forEach((input, index) => {
      aux.push({
        id: input.id,
        name: input.name,
        quantity: input.quantity,
        sku: input.sku,
        unit: input.unit,
        index: index
      })
    });
    this.inputTableDataSource.data = aux;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
  }

  initForms(){
    this.productForm = this.fb.group({
      productCategory: [{value: this.data.category, disabled: true }],
      productName: [{value: this.data.name, disabled: true }]
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
    if(typeof this.itemForm.get('item').value != 'string'){
      let table = this.inputTableDataSource.data;
      table.push({
        ...this.itemForm.get('item').value,
        quantity: this.itemForm.get('quantity').value,
        index: this.inputTableDataSource.data.length
        });
      console.log(table);
      this.inputTableDataSource.data = table;
      this.inputTableDataSource.paginator = this.inputTablePaginator;
    }
    else{
      this.snackBar.open('Por favor, seleccione correctamente el item', 'Aceptar');
    }
  }

  onDeleteItem(item,index){
    let table = this.inputTableDataSource.data;
    table.splice(index, 1);
    table.forEach((el, index) => {el['index'] = index})
    this.inputTableDataSource.data = table;
    this.inputTableDataSource.paginator = this.inputTablePaginator;
    console.log(item);
  }

  //Change to update
  onUploadRecipe(){
    let recipe: Recipe = this.data;

    recipe.inputs = [];

    this.inputTableDataSource.data.forEach(el => {
      recipe.inputs.push({
        name: el['name'],
        sku: el['sku'],
        quantity: el['quantity'],
        id: el['id'],
        unit: el['unit']
      });
    });

    this.dbs.onEditRecipe(recipe).pipe(tap((batch)=> {
      batch.commit().then(()=> {
        this.snackBar.open('La receta fue editada satisfactoriamente', 'Aceptar');
      })
      .catch((err)=> {
        console.log(err);
        this.snackBar.open('Ocurrió un error, por favor, vuelva a editar la receta', 'Aceptar')
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


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { CreateNewRecipeDialogComponent } from './create-new-recipe-dialog/create-new-recipe-dialog.component';
import { Recipe } from 'src/app/core/models/kitchen/recipe.model';
import { DatabaseService } from 'src/app/core/database.service';
import { Input } from 'src/app/core/models/warehouse/input.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  productCategory: Array<string> = [
    'Platos', 'Piqueo', 'Extras', 'Bebidas'
  ]

  //Table
  inputTableDataSource = new MatTableDataSource();
  inputTableDisplayedColumns: string[] = [
    'index', 'name', 'unit', 'quantity'
  ]
  @ViewChild('recipeTablePaginator', {static:false}) recipeTablePaginator: MatPaginator;

  searchForm: FormGroup;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  availableOptions$: Observable<string | Recipe[]>;
  getRecipe$: Observable<Recipe | string>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.initForm();

    this.availableOptions$ = this.searchForm.get('productName').valueChanges.pipe(
      //First tap to initialize table data
      tap((productName: Recipe | string)=>{
        if(typeof productName=='string'){
          this.inputTableDataSource.data = [];
        }
        else{
          this.inputTableDataSource.data = productName.inputs;
        }
      }),
      //switchMap to get filtered data of options available
      switchMap((productName)=> {
        return this.dbs.onGetRecipesType(this.searchForm.get('productCategory').value).pipe(
          debounceTime(500), 
          map((recipesList: Recipe[])=> {
            console.log(recipesList);
            return this.filterRecipe(recipesList, this.searchForm.get('productName').value)
          }))
      }));

  }

  

  
  displayFn(input: Input) {
    if (!input) return '';
    return input.name.split('')[0].toUpperCase() + input.name.split('').slice(1).join('').toLowerCase();
  }

  initForm(){
    this.searchForm = this.fb.group({
      productCategory: [null, Validators.required],
      productName: [null, Validators.required]
    });
  }

  onCreateProduct(){
    this.dialog.open(CreateNewRecipeDialogComponent,
      {
        width: '550px'
      });
    console.log('creating');
  }

  onEditRecipe(){
    console.log('editing');
  }

  onDeleteRecipe(){
    console.log('deleting')
  }

  filterRecipe(recipeList: Recipe[], recipeName: Recipe | string){
    if(typeof recipeName != 'string'){
      return recipeList.filter(recipe => recipe.name.toUpperCase().includes(recipeName.name.toUpperCase()))
    }
    else{
      return recipeList.filter(recipe => recipe.name.toUpperCase().includes(recipeName.toUpperCase()))
    }
  }


  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CreateNewRecipeDialogComponent } from './create-new-recipe-dialog/create-new-recipe-dialog.component';
import { Recipe } from 'src/app/core/models/kitchen/recipe.model';
import { DatabaseService } from 'src/app/core/database.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  productCategory: Array<string> = [
    'Platos', 'Piqueo', 'Extras', 'Bebidas'
  ]

  searchForm: FormGroup;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  availableOptions$: Observable<string | Recipe[]>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.initForm();
    this.filteredOptions = this.searchForm.get('productName').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.availableOptions$ = combineLatest(this.searchForm.get('productName').valueChanges,
                              this.dbs.onGetRecipesType(this.searchForm.get('productCategory').value)).pipe(
      map(([productName, recipesList])=> {
        console.log('retreiving');
        return this.filterRecipe(recipesList, productName)
      }), startWith('')
    )

  }

  initForm(){
    this.searchForm = this.fb.group({
      productCategory: [null, Validators.required],
      productName: [null, Validators.required]
    });
  }

  onSearchProduct(){
    console.log(this.searchForm.value);
  }

  onCreateProduct(){
    this.dialog.open(CreateNewRecipeDialogComponent,
      {
        width: '550px'
      });
    console.log('creating');
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

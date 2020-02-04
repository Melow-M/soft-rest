import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CreateNewRecipeDialogComponent } from './create-new-recipe-dialog/create-new-recipe-dialog.component';

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

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initForm();
    this.filteredOptions = this.searchForm.get('productName').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}

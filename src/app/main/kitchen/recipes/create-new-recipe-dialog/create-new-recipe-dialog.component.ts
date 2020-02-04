import { Component, OnInit, ChangeDetectionStrategy, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Dessert } from 'src/app/core/models/warehouse/desserts.model';
import { Observable, combineLatest } from 'rxjs';
import { Grocery } from 'src/app/core/models/warehouse/grocery.model';
import { Household } from 'src/app/core/models/warehouse/household.model';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { Tool } from 'src/app/core/models/warehouse/tools.model';
import { DatabaseService } from 'src/app/core/database.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-new-recipe-dialog',
  templateUrl: './create-new-recipe-dialog.component.html',
  styleUrls: ['./create-new-recipe-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateNewRecipeDialogComponent implements OnInit {
  productCategory: Array<string> = [
    'Platos', 'Piqueo', 'Extras', 'Bebidas'
  ]

  productForm: FormGroup;
  itemForm: FormGroup;

  inputList: Observable<string | Input[]>;

  constructor(
    private fb: FormBuilder,
    private dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.initForms();
    this.inputList = combineLatest(this.dbs.onGetInputs(), this.itemForm.get('item').valueChanges)
      .pipe(map(([inputList, inputForm])=> this.onFilterInputs(inputList, inputForm)),
            startWith(''))
  }

  initForms(){
    this.productForm = this.fb.group({
      productCategory: [null, Validators.required],
      productName: [null, Validators.required]
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

  onAddItem(){
    console.log(this.itemForm.value)
  }

  displayFn(input: Input) {
    if (!input) return '';
    return input.name.split('')[0].toUpperCase() + input.name.split('').slice(1).join('').toLowerCase();
  }

}

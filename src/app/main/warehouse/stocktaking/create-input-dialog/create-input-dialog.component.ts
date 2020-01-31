import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-input-dialog',
  templateUrl: './create-input-dialog.component.html',
  styleUrls: ['./create-input-dialog.component.css']
})
export class CreateInputDialogComponent implements OnInit {
  unitList: String[] = [
    'Kilos', 'Litros'
  ]
  filteredUnitList: Observable<String[]>;

  inputFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.inputFormGroup = this.fb.group({
      name: [null, Validators.required],
      sku: [null, Validators.required],       //Falta validador asincrono
      unit: [null, Validators.required],
      description: [null, Validators.required],
      stock: [null, Validators.required],
      cost: [null, Validators.required],
    });

    this.inputFormGroup.get('name').valueChanges.pipe(
      startWith(''), 
      tap((name: string) => {
      console.log('now');
      this.inputFormGroup.get('name').setValue(this.formatInput(name))
      }));

    this.inputFormGroup.get('unit').valueChanges.pipe(
      startWith(''),
      tap((unit: string)=> {
        let newUnit = this.formatInput(unit);
        this.inputFormGroup.get('unit').setValue(this.formatInput(newUnit));
        this.filterUnits(this.formatInput(newUnit));
      })
      )
  }

  filterUnits(value: string): String[] {
    const filterValue = value.toUpperCase();
    return this.unitList.filter(unit => unit.toUpperCase().includes(filterValue))
  }

  formatInput(value: string){
    let aux = value;
    let regex = new RegExp(/\s.+/, 'ig');
    aux.replace(regex, ' ');
    return aux.toUpperCase().trim();
  }

}

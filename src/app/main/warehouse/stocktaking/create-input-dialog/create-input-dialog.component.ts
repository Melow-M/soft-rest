import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { tap, startWith, map, debounceTime, filter, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-input-dialog',
  templateUrl: './create-input-dialog.component.html',
  styleUrls: ['./create-input-dialog.component.css']
})
export class CreateInputDialogComponent implements OnInit {
  //Variables
  typesList: String[] = ['Insumos', 'Otros', 'Postres', 'Menajes'];

  unitList: {id: string, unit: string}[] = [ ];
  filteredUnitList: {id: string, unit: string}[];

  inputFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dbs: DatabaseService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dbs.onGetUnits().pipe(take(1)).subscribe(res => {
      this.unitList = res;
      this.filteredUnitList = res;
    })
    this.initForm();
  }

  initForm(){
    this.inputFormGroup = this.fb.group({
      type: [null, Validators.required],
      name: [{value: null, disabled: true}, Validators.required, this.repeatedName(this.dbs)],
      sku: [{value: null, disabled: true}, Validators.required, this.repeatedCode(this.dbs)],       //Falta validador asincrono
      unit: [null, Validators.required],
      description: [null, Validators.required],
      stock: [null, Validators.required],
      cost: [null, Validators.required],
    });

    this.inputFormGroup.get('name').valueChanges.pipe(
      debounceTime(500),
      startWith(''), 
      filter((name: string )=> name != this.formatInput(name)),
      tap((name: string) => {
      console.log('now');
      this.inputFormGroup.get('name').setValue(this.formatInput(name))
      }))
      .subscribe();


    this.inputFormGroup.get('unit').valueChanges.pipe(
      debounceTime(500),
      startWith(' '),
      filter((unit: string )=> unit != this.formatInput(unit)),
      tap((unit: string)=> {
        let newUnit = this.formatInput(unit);
        this.inputFormGroup.get('unit').setValue(newUnit);
        this.filteredUnitList = this.filterUnits(newUnit);
      })
      ).subscribe();

    this.inputFormGroup.get('type').valueChanges.pipe(
      tap((type)=> {
        if(type!=null){
          this.inputFormGroup.get('name').enable();
          this.inputFormGroup.get('sku').enable();
        }
        else{
          this.inputFormGroup.get('name').disable();
          this.inputFormGroup.get('sku').disable();
        }
      })
    ).subscribe();

  }

  onCreateInput(){
    let aux = this.unitList.find((unit) => (unit.unit == this.inputFormGroup.get('unit').value));

    if(aux != undefined){
      this.dbs.onAddInput(this.inputFormGroup.value, this.inputFormGroup.get('type').value, aux)
      .subscribe(batch => {
        batch.commit().then(()=> {
            this.snackbar.open('Se creo el insumo exitosamente', 'Aceptar', {duration: 6000});
          }
        ).catch(()=>{
          this.snackbar.open('Error. Vuelva a crear el insumo', 'Aceptar', {duration: 6000});
        })
      });
    }
    else{
      this.dbs.onAddInput(this.inputFormGroup.value, this.inputFormGroup.get('type').value)
      .subscribe(batch => {
        batch.commit().then(()=> {
            this.snackbar.open('Se creo el insumo exitosamente', 'Aceptar', {duration: 6000});
          }
        ).catch(()=>{
          this.snackbar.open('Error. Vuelva a crear el insumo', 'Aceptar', {duration: 6000});
        })
      });
    }
  }

  //Synchronous Validators
  repeatedName(dbs: DatabaseService){
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(control.parent.get('type').value);
      return dbs.onGetElements(control.parent.get('type').value).pipe(
        debounceTime(500),
        take(1),
        map(inputList => {
          console.log(inputList)
          let aux = inputList.find(input => (input.name == control.value));
          if(aux != undefined){
            return {repeatedName: true};
          }
          else return null;
        })
      )
    }
  }

  repeatedCode(dbs: DatabaseService){
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return dbs.onGetElements(control.parent.get('type').value).pipe(
        debounceTime(500),
        take(1),
        map(inputList => {
          let aux = inputList.find(input => (input.sku == control.value));
          if(aux != undefined){
            return {repeatedCode: true};
          }
          else return null;
        })
      )
    }
  }

  //utils for Form
  filterUnits(value: string): {id: string, unit: string}[] {
    console.log(value)
    if(!value.length){
      return this.unitList;
    }
    const filterValue = value.toUpperCase();
    return this.unitList.filter(unit => unit.unit.toUpperCase().includes(filterValue))
  }

  formatInput(value: string){
    let aux = value;
    let regex = new RegExp(/\s+/, 'ig');
    if(aux != null){
      aux = aux.replace(regex, ' ');
      return aux.toUpperCase().trim();
    }
    else return value;
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatPaginator, MatSnackBar, MatDialogRef } from '@angular/material';
import { Provider } from 'src/app/core/models/third-parties/provider.model';
import { KitchenInput } from 'src/app/core/models/warehouse/kitchenInput.model';
import { CreateProviderDialogComponent } from 'src/app/main/third-parties/providers/create-provider-dialog/create-provider-dialog.component'
import { CreateInputDialogComponent } from '../../stocktaking/create-input-dialog/create-input-dialog.component';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, debounceTime, take } from 'rxjs/operators';

@Component({
  selector: 'app-register-documents',
  templateUrl: './register-documents.component.html',
  styleUrls: ['./register-documents.component.css']
})
export class RegisterDocumentsComponent implements OnInit {
  //Table
  inputsTableDataSource = new MatTableDataSource([]);
  inputsTableDisplayedColumns = ['N°', 'Tipo', 'Producto', 'Medida', 'Cantidad', 'Costo', 'Acciones'];

  //Paginators
  @ViewChild('inputsTablePaginator', {static: false}) inputsTablePaginator: MatPaginator;

  documentForm: FormGroup;
  itemsListForm: FormGroup;

  //Templates
  providers: Provider[];
  items: KitchenInput[];
  documentType: String[] = [
    'BOLETA', 'FACTURA', 'TICKET'
  ]
  paymentType: String[] = [
    'CREDITO', 'EFECTIVO', 'TARJETA'
  ]
  inputList: Observable<KitchenInput[]>;
  providersList$: Observable<Provider[]>
  socialReason$: Observable<string>;

  savingPurchase = new BehaviorSubject(false);
  savingPurchase$ = this.savingPurchase.asObservable();

  types: String[] = ['Insumos', 'Otros', 'Postres', 'Menajes'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dbs: DatabaseService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<RegisterDocumentsComponent>
  ) { }

  ngOnInit() {
    this.initForms();
    this.providersList$ = this.dbs.getProviders();
    this.inputList = of([]);
  }

  initForms(){
    this.documentForm = this.fb.group({
      documentDetails: this.fb.group({
        documentDate: [null, Validators.required],
        documentType: [null, Validators.required, this.purchaseValidator(this.dbs)],
        documentSerial: [null, Validators.required, this.purchaseValidator(this.dbs)],
        documentCorrelative: [null, Validators.required, this.purchaseValidator(this.dbs)],
        socialReason: [{value: null, disabled: true}, Validators.required],     //Depends on RUC, should not be sent
        provider: [null, Validators.required, this.purchaseValidator(this.dbs)],
        paymentType: [null, Validators.required],
        creditExpirationDate: [{value: null, disabled: true}, Validators.required]  //Depend on Credito
      }),
      imports: this.fb.group({
        subtotalImport: [{value: null, disabled: true}, Validators.required],   //Depends on RUC
        igvImport: [{value: null, disabled: true}, Validators.required],        //Depends on RUC // 0.18
        totalImport: [{value: null, disabled: true}, Validators.required],
        paidImport: [null, Validators.required],
        indebtImport: [{value: null, disabled: true}, Validators.required],
      }),
    });
    this.itemsListForm = this.fb.group({
      kitchenInputId: null,
      type: [null, Validators.required],
      item: [{value: null, disabled: true}, Validators.required],
      quantity: [null, Validators.required],
      cost: [null, Validators.required]    //Have to check, if we need to disable
    })
    //La lista de items debe ser puntual

    this.documentForm.get('documentDetails.paymentType').valueChanges.subscribe((obs)=>{
      if(obs == 'CREDITO'){
        this.documentForm.get('documentDetails.creditExpirationDate').enable();
      }
      else{
        this.documentForm.get('documentDetails.creditExpirationDate').disable();
      }
    });

    this.itemsListForm.get('item').valueChanges.subscribe((item: KitchenInput) => {
      if(item != null){
        this.itemsListForm.get('cost').setValue(item.cost);
        this.itemsListForm.get('kitchenInputId').setValue(item.id);
      }
    })

    this.itemsListForm.get('type').valueChanges.subscribe((type: string)=> {
      if(type!= null){
        this.inputList = this.dbs.onGetElements(type);
        this.itemsListForm.get('item').enable()
      }
      else{
        this.inputList = of([]);
        this.itemsListForm.get('item').disable();
      }
    })

    this.socialReason$ = this.documentForm.get('documentDetails.provider').valueChanges.pipe(map((provider: Provider)=> {
      if(provider != null){
        return provider.name;
      }
      else{
        return null;
      }
    }))

    this.documentForm.get('imports.paidImport').valueChanges.subscribe((res: number) => {
      this.documentForm.get('imports.indebtImport').setValue(Math.round(this.getTotalCost()*100.0 - res*100.0)/100.0)
    })

  }

  onAddProvider(){
    this.dialog.open(CreateProviderDialogComponent, {
      width: '100vw',
      height: '90vh'
    });
  }

  onCreateInput(){
    this.dialog.open(CreateInputDialogComponent, {
      width: '450px',
      height: '90vh'
    });
  }

  onAddInput(){
    this.inputsTableDataSource.data = [
      ...this.inputsTableDataSource.data,
      this.itemsListForm.value
    ];
    this.inputsTableDataSource.paginator = this.inputsTablePaginator;
  }

  onDeleteInput(element){
    let aux = this.inputsTableDataSource.data;
    this.inputsTableDataSource.data = aux.filter(el => element!=el);

  }

  getSubTotal() {
    return Math.round(this.getTotalCost() * 100.0 / 1.18) / 100.0;
  }

  getIGV() {
    return Math.round((this.getTotalCost() - this.getSubTotal())*100.0) /100.0;
  }

  getTotalCost(){
    let aux = this.inputsTableDataSource.data;
    return aux.reduce((accumulator, currentValue) => {
      return (accumulator*100.0 + Math.round(currentValue['cost']*100.0))/100.0;
    }, 0)
  }


  onSubmitPurchase(){
    this.savingPurchase.next(true);
    if(this.documentForm.get('documentDetails.documentType').value == 'FACTURA'){
      this.documentForm.get('imports.subtotalImport').enable();
      this.documentForm.get('imports.igvImport').enable();
      this.documentForm.get('imports.totalImport').enable();
      this.documentForm.get('imports.indebtImport').enable();

      this.documentForm.get('imports.subtotalImport').setValue(this.getSubTotal());
      this.documentForm.get('imports.igvImport').setValue(this.getIGV());
      this.documentForm.get('imports.totalImport').setValue(this.getTotalCost());
    }
    else{
      this.documentForm.get('imports.totalImport').enable();
      this.documentForm.get('imports.indebtImport').enable();
      this.documentForm.get('imports.totalImport').setValue(this.getTotalCost());
    }
    console.log(this.documentForm.value);
    this.dbs.onAddPurchase(this.documentForm.value, this.inputsTableDataSource.data).subscribe(batch => {
      batch.commit().then(() => {
        this.snackbar.open('Se registró la compra exitosamente', 'Aceptar', {duration: 6000});
        this.dialogRef.close();
      }).catch((err) => {
        console.log(err);
        console.log(this.inputsTableDataSource.data);
        this.snackbar.open('Ocurrió un error. Por favor, vuelva a intentarlo.', 'Aceptar', {duration: 6000});
        this.documentForm.get('imports.subtotalImport').disable();
        this.documentForm.get('imports.igvImport').disable();
        this.documentForm.get('imports.totalImport').disable();
        this.documentForm.get('imports.indebtImport').disable();
        this.savingPurchase.next(false);
      })
    });
  }

  //Validators
  purchaseValidator(dbs: DatabaseService){
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if(
        control.parent.get('documentType').value == null ||
        control.parent.get('documentSerial').value == null ||
        control.parent.get('documentCorrelative').value == null ||
        control.parent.get('provider').value == null
      ){
        return of(null)
      }
      else{
        return dbs.repPurchaseValidator(
          control.parent.get('documentType').value,
          control.parent.get('documentSerial').value,
          control.parent.get('documentCorrelative').value,
          control.parent.get('provider').value,
        ).pipe(debounceTime(500),take(1),tap((res)=> {
          if(res != null){
            this.snackbar.open('Esta compra ya se encuentra registrada', 'Aceptar', {duration: 6000});
            control.parent.get('documentType').setValue(null);
            control.parent.get('documentSerial').setValue(null);
            control.parent.get('documentCorrelative').setValue(null);
            control.parent.get('provider').setValue(null);
          }
        }))
      }
    }
  }
  
}
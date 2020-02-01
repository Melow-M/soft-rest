import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { Provider } from 'src/app/core/models/third-parties/provider.model';
import { KitchenInput } from 'src/app/core/models/warehouse/kitchenInput.model';
import { CreateProviderDialogComponent } from 'src/app/main/third-parties/providers/create-provider-dialog/create-provider-dialog.component'
import { CreateInputDialogComponent } from '../../stocktaking/create-input-dialog/create-input-dialog.component';
import { DatabaseService } from 'src/app/core/database.service';
import { Observable, of } from 'rxjs';

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
  types: String[] = ['Insumos', 'Otros', 'Postres', 'Menajes'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.initForms();
    this.inputList = of([]);
  }

  initForms(){
    this.documentForm = this.fb.group({
      documentDetails: this.fb.group({
        documentDate: [null, Validators.required],
        documentType: [null, Validators.required],
        documentSerial: [null, Validators.required],
        documentCorrelative: [null, Validators.required],
        socialReason: [{value: null, disabled: true}, Validators.required],     //Depends on RUC, should not be sent
        provider: [null, Validators.required],
        paymentType: [null, Validators.required],
        creditExpirationDate: [{value: null, disabled: true}, Validators.required]  //Depend on Credito
      }),
      imports: this.fb.group({
        subtotalImport: [{value: null, disabled: true}, Validators.required],   //Depends on RUC
        igvImport: [{value: 0.12, disabled: true}, Validators.required],        //Depends on RUC
        totalImport: [null, Validators.required],
        paidImport: [null, Validators.required],
        indebtImport: [null, Validators.required],
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

    this.documentForm.get('documentDetails.documentType').valueChanges.subscribe((obs)=>{
      if(obs == 'FACTURA'){
        this.documentForm.get('imports.subtotalImport').enable();
        this.documentForm.get('imports.igvImport').enable();
      }
      else{
        this.documentForm.get('imports.subtotalImport').disable();
        this.documentForm.get('imports.igvImport').disable();
      }
    })

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

  getTotalCost(){
    let aux = this.inputsTableDataSource.data;
    return aux.reduce((accumulator, currentValue) => {
      return accumulator + currentValue['cost'];
    }, 0)
  }

  
}

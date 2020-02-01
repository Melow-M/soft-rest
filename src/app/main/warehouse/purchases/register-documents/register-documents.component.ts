import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Provider } from 'src/app/core/models/third-parties/provider.model';
import { Input } from 'src/app/core/models/warehouse/input.model';
import { CreateProviderDialogComponent } from 'src/app/main/third-parties/providers/create-provider-dialog/create-provider-dialog.component'

@Component({
  selector: 'app-register-documents',
  templateUrl: './register-documents.component.html',
  styleUrls: ['./register-documents.component.css']
})
export class RegisterDocumentsComponent implements OnInit {
  documentForm: FormGroup;
  itemsListForm: FormGroup;

  //Templates
  providers: Provider[];
  items: Input[];
  documentType: String[] = [
    'BOLETA', 'FACTURA', 'TICKET'
  ]
  paymentType: String[] = [
    'CREDITO', 'EFECTIVO', 'TARJETA'
  ]

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.initForms();
  }

  initForms(){
    this.documentForm = this.fb.group({
      documentDetails: this.fb.group({
        documentDate: [null, Validators.required],
        documentType: [null, Validators.required],
        documentSerial: [null, Validators.required],
        documentCorrelative: [null, Validators.required],
        socialReason: [{value: null, disabled: true}, Validators.required],     //Depends on RUC
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
      inputId: null,
      item: [null, Validators.required],
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
    })

  }

  onAddProvider(){
    this.dialog.open(CreateProviderDialogComponent, {
      width: '100vw',
      height: '90vh'
    });
  }

  
}

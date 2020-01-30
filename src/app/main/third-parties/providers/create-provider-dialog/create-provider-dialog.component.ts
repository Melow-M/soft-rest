import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-provider-dialog',
  templateUrl: './create-provider-dialog.component.html',
  styleUrls: ['./create-provider-dialog.component.css']
})
export class CreateProviderDialogComponent implements OnInit {
  bankList: String[] = [
    'BBVA CONTINENTAL', 'BCP', 'INTERBANK', 'SCOTIABANK', 'CAJA AREQUIPA'
  ]
  typeList: String[] = [
    'AHORROS', 'CTA. CORRIENTE'
  ]

  providerInfoFormGroup: FormGroup;
  bankAccountsFormGroup: FormGroup;
  contactsFormGroup: FormGroup;

  //Variables
  bankAccounts: Array<{  //Opciones dadas en interiores
    bank: string;   
    type: string;
    accountNumber: string;
  }>;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.providerInfoFormGroup = this.fb.group({
      ruc: [null, Validators.required],
      name: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null],
      detractionAccount: [null]
    });

    this.bankAccountsFormGroup = this.fb.group({
      bank: [null, Validators.required],
      type: [null, Validators.required],
      accountNumber: [null, Validators.required]
    })

    this.contactsFormGroup = this.fb.group({
      contactName: [null, Validators.required],
      contactPhone: [null, Validators.required],
      contactMail: [null, Validators.required]
    })
  }

  onAddAccount(){
    console.log()
  }

}

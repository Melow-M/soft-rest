import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';

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
  }> = [];
  contacts: Array<{
    contactName: string;
    contactPhone: string;
    contactMail: string;
  }> = [];

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
      bank: [null],
      type: [null],
      accountNumber: [null]
    })

    this.contactsFormGroup = this.fb.group({
      contactName: [null],
      contactPhone: [null],
      contactMail: [null]
    })
  }

  onAddAccount(){
    this.bankAccounts.push(this.bankAccountsFormGroup.value);
    this.bankAccountsFormGroup.reset();
  }

  onDeleteAccount(account){
    this.bankAccounts = this.bankAccounts.filter(el => el != account)
  }

  onAddContact(){
    this.contacts.push(this.contactsFormGroup.value);
    this.contactsFormGroup.reset();
  }
  onDeleteContact(contact){
    this.contacts = this.contacts.filter(el => el != contact)
  }
}

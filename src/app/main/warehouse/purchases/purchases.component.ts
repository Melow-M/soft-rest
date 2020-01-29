import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PurchasesComponent implements OnInit {
  dateForm: FormGroup;
  providersList: string[] = ['Primero', 'Segundo', 'Tercero']

  constructor(
    private formBuilder: FormBuilder
  ) { 
    
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(){

    this.dateForm = this.formBuilder.group({
      date: [{begin: new Date(), end: new Date()}]
    })
  }
}

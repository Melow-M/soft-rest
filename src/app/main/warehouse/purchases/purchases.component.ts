import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { RegisterDocumentsComponent } from './register-documents/register-documents.component';
import { DatabaseService } from 'src/app/core/database.service';
import { ThirdPartiesComponent } from '../../third-parties/third-parties.component';

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
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private dbs: DatabaseService
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

  onRegistering(){
    this.dialog.open(RegisterDocumentsComponent, {
      width: '100vw',
    });
  }

  onSearching(){
    this.dbs.onGetPurchases(this.dateForm.get('date').value['begin'], this.dateForm.get('date').value['end']).subscribe();
  }
}

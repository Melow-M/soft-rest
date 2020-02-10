import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/core/database.service';
import { CreateNewPromoDialogComponent } from './create-new-promo-dialog/create-new-promo-dialog.component';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css']
})
export class PromosComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private dbs: DatabaseService
  ) { }

  ngOnInit() {
  }

  onCreateNewPromo(){
    this.dialog.open(CreateNewPromoDialogComponent, {
      width: '550px',
    })
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-open-cash',
  templateUrl: './open-cash.component.html',
  styleUrls: ['./open-cash.component.css']
})
export class OpenCashComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<OpenCashComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  open(){
    this.dialog.close({
      open: !this.data.open
    })
  }
}

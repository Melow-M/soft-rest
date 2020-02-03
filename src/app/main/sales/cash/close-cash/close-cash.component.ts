import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-close-cash',
  templateUrl: './close-cash.component.html',
  styleUrls: ['./close-cash.component.css']
})
export class CloseCashComponent implements OnInit {
  hidePass: boolean = true;
  checked: boolean = false

  bills: Array<any> = [
    {
      name: 'Billete S/. 200',
      value: 200,
      quantity: 2
    },
    {
      name: 'Billete S/. 100',
      value: 100,
      quantity: 0
    },
    {
      name: 'Billete S/. 50',
      value: 50,
      quantity: 0
    },
    {
      name: 'Billete S/. 20',
      value: 20,
      quantity: 1
    },
    {
      name: 'Billete S/. 10',
      value: 10,
      quantity: 1
    },
    {
      name: 'Moneda S/. 5',
      value: 5,
      quantity: 0
    },
    {
      name: 'Moneda S/. 2',
      value: 2,
      quantity: 0
    },
    {
      name: 'Moneda S/. 1',
      value: 1,
      quantity: 0
    },
    {
      name: 'Otras Monedas',
      value: 1,
      quantity: 0
    },

  ]

  displayedColumns: string[] = ['name', 'quantity', 'total'];
  dataSource = new MatTableDataSource();

  constructor(
    private dialog: MatDialogRef<CloseCashComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.dataSource.data = this.bills
  }

  close(){
    this.dialog.close({
      close: true
    })
  }

}

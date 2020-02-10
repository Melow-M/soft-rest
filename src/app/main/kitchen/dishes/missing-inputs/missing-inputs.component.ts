import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-missing-inputs',
  templateUrl: './missing-inputs.component.html',
  styleUrls: ['./missing-inputs.component.css']
})
export class MissingInputsComponent implements OnInit {
  example = [
    {
      supplie: 'palta',
      unit: 'kilos',
      amount: 2
    },
    {
      supplie: 'cebolla',
      unit: 'kilos',
      amount: 0.5
    },
    {
      supplie: 'Wantan',
      unit: 'unidades',
      amount: 5
    },
    {
      supplie: 'tomate',
      unit: 'unidades',
      amount: 3
    }
  ]

  displayedColumns: string[] = ['index', 'supplie', 'unit', 'amount'];
  dataSource = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }


  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.example
  }

}

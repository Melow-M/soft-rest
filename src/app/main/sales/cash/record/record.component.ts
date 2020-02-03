import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  example: Array<any> = [
    {
      opening: new Date(),
      closing: new Date(),
      openingBalance: 100,
      totalBalance: 2900,
      totalIncomes: 2830,
      totalExpensives: 30,
      responsible: 'Juan Perez'
    },
    {
      opening: new Date(),
      closing: new Date(),
      openingBalance: 100,
      totalBalance: 2900,
      totalIncomes: 2830,
      totalExpensives: 30,
      responsible: 'Juan Perez'
    },
    {
      opening: new Date(),
      closing: new Date(),
      openingBalance: 100,
      totalBalance: 2900,
      totalIncomes: 2830,
      totalExpensives: 30,
      responsible: 'Juan Perez'
    },
    {
      opening: new Date(),
      closing: new Date(),
      openingBalance: 100,
      totalBalance: 2900,
      totalIncomes: 2830,
      totalExpensives: 30,
      responsible: 'Juan Perez'
    },
    {
      opening: new Date(),
      closing: new Date(),
      openingBalance: 100,
      totalBalance: 2900,
      totalIncomes: 2830,
      totalExpensives: 30,
      responsible: 'Juan Perez'
    }
  ]

  displayedColumns: string[] = ['index', 'opening', 'closing', 'openingBalance', 'totalBalance', 'totalIncomes', 'totalExpensives', 'responsible', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }


  constructor() { }

  ngOnInit() {

    this.dataSource.data = this.example
  }

}

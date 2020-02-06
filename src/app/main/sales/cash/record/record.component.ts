import { FormBuilder, FormGroup } from '@angular/forms';
import { tap, startWith, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
 
  displayedColumns: string[] = ['index', 'opening', 'closing', 'openingBalance', 'totalBalance', 'totalIncomes', 'totalExpensives', 'responsible', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  openings$:Observable<any>

  search: FormGroup


  constructor(
    public dbs: DatabaseService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.search = this.fb.group({
      initDate: [''],
      finalDate: ['']
    })

    this.openings$ = 
    combineLatest(
      this.dbs.getOpenCash(this.data['id']),
      this.search.get('initDate').valueChanges.pipe(
        startWith('')
      ),
      this.search.get('finalDate').valueChanges.pipe(
        startWith('')
      ),
    ).pipe(
      map(([cashes,init,final])=>{
        return cashes.filter(el => {
          if (init || final) {
            return this.filterTime(init, final, el)
          } else {
            return true
          }
        })
      }),
      tap(res=>{
        this.dataSource.data = res
      })
    )
    
  }

  filterTime(from, to, el) {
    if (from && to) {
      return el['openendAt'].toMillis() >= from.getTime() && el['openendAt'].toMillis() <= to.setHours(23, 59, 59)
    } else {
      if (from) {
        return el['openendAt'].toMillis() >= from.getTime()
      } else if (to) {
         return el['openendAt'].toMillis() <= to.setHours(23, 59, 59)
      }
    }
  }

}

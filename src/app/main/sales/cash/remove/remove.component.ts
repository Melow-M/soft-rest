import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.css']
})
export class RemoveComponent implements OnInit {
  typesExpenses = ['GASTO', 'DEVOLUCIONES', 'PAGO PERSONAL', 'OTROS']
  typesPayment = ['EFECTIVO', 'TRANSFERENCIA']
  users = ['user1', 'user2']

  confirm:boolean = false
  constructor() { }

  ngOnInit() {
  }

}

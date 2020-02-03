import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  typesIncome = ['tipo1', 'tipo2']
  users = ['user1', 'user2']

  confirm:boolean = false
  constructor() { }

  ngOnInit() {
  }

}

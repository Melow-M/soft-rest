import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  openedMenu: boolean = false;
  salesOpenedFlag: boolean = false;
  warehouseOpenedFlag: boolean = false;
  kitchenOpenedFlag: boolean = false;
  adminOpenedFlag: boolean = false;
  thirdOpenedFlag: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }
  toggleSideMenu(): void {
    this.openedMenu = !this.openedMenu;
  }
  salesOpened(): void {
    this.salesOpenedFlag = true;
  }

  salesClosed(): void {
    this.salesOpenedFlag = false;
  }

  warehouseOpened(): void {
    this.warehouseOpenedFlag = true;
  }

  warehouseClosed(): void {
    this.warehouseOpenedFlag = false;
  }

  kitchenOpened(): void {
    this.kitchenOpenedFlag = true;
  }

  kitchenClosed(): void {
    this.kitchenOpenedFlag = false;
  }

  adminOpened(): void {
    this.adminOpenedFlag = true;
  }

  adminClosed(): void {
    this.adminOpenedFlag = false;
  }

  thirdOpened(): void {
    this.thirdOpenedFlag = true;
  }

  thirdClosed(): void {
    this.thirdOpenedFlag = false;
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  openedMenu: boolean = false;
  salesOpenedFlag: boolean = false;
  qualityOpenedFlag: boolean = false;
  maintenanceOpenedFlag: boolean = false;
  ssggOpenedFlag: boolean = false;
  utilizationOpenedFlag: boolean = false;
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

  qualityOpened(): void {
    this.qualityOpenedFlag = true;
  }

  qualityClosed(): void {
    this.qualityOpenedFlag = false;
  }

  maintenanceOpened(): void {
    this.maintenanceOpenedFlag = true;
  }

  maintenanceClosed(): void {
    this.maintenanceOpenedFlag = false;
  }

  ssggOpened(): void {
    this.ssggOpenedFlag = true;
  }

  ssggClosed(): void {
    this.ssggOpenedFlag = false;
  }

  utilizationOpened(): void {
    this.utilizationOpenedFlag = true;
  }

  utilizationClosed(): void {
    this.utilizationOpenedFlag = false;
  }

}

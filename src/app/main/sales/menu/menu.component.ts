import { VoucherComponent } from './voucher/voucher.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  categoriesList: boolean = true
  MenuList: boolean = false
  generateSale: boolean = false

  billView: boolean = true
  ticketView: boolean = false
  checketView: boolean = false

  cashView = true
  visaView = false
  masterCardView = false

  selectablePlate: any = null

  plates = [
    {
      name: 'Tequeños',
      type: 'entry',
      initialStock: 50,
      stock: 45
    },
    {
      name: 'Caldo Blanco',
      type: 'soup',
      initialStock: 30,
      stock: 24
    },
    {
      name: 'Caldo de Pollo',
      type: 'soup',
      initialStock: 20,
      stock: 20
    },
    {
      name: 'Lomo Saltado',
      type: 'second',
      initialStock: 50,
      stock: 1
    },
    {
      name: 'Ají de gallina',
      type: 'second',
      initialStock: 30,
      stock: 24
    },
    {
      name: 'Arroz Chaufa',
      type: 'second',
      initialStock: 20,
      stock: 20
    },
    {
      name: 'Gelatina',
      type: 'dessert',
      initialStock: 20,
      stock: 2
    },
    {
      name: 'Fruta',
      type: 'dessert',
      initialStock: 60,
      stock: 20
    }
  ]

  entry = this.plates.filter(el => el['type'] == 'entry')
  soup = this.plates.filter(el => el['type'] == 'soup')
  second = this.plates.filter(el => el['type'] == 'second')
  dessert = this.plates.filter(el => el['type'] == 'dessert')

  order = [
    {
      type: 'executive',
      price: 10,
      name: 'Menú Ejecutivo',
      plate: {
        entry: 'Tequeños',
        second: 'Lomo Saltado',
        dessert: 'Fruta'
      },
      index: 0
    },
    {
      type: 'simple',
      price: 8,
      name: 'Menú Básico',
      plate: {
        soup: 'Caldo Blanco',
        second: 'Ají de gallina'
      },
      index: 1
    }
  ]

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  printVoucher() {
    this.dialog.open(VoucherComponent)
  }

  selectedDish(plate) {
    if (this.selectablePlate) {
      let i = this.selectablePlate['index']
      this.order[i]['plate'][plate['type']] = plate['name']
      console.log(this.order[i]);
      console.log(plate);
    }
  }

}

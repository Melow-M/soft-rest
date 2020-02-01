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
        soup: '',
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
        entry: '',
        soup: 'Caldo Blanco',
        second: 'Ají de gallina',
        dessert: ''
      },
      index: 1
    }
  ]

  total: number = this.order.map(el => el['price']).reduce((a, b) => a + b, 0);

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  firstOrder(type, price, name) {
    let selectEntry = this.entry.map(el => el['stock'])
    let selectSoup = this.soup.map(el => el['stock'])
    let selectSecond = this.second.map(el => el['stock'])
    let selectDessert = this.dessert.map(el => el['stock'])
    let newDish = {
      type: type,
      price: price,
      name: name,
      plate: {
        entry: this.plates.filter(el => el['stock'] == Math.min(...selectEntry))[0]['name'],
        soup: this.plates.filter(el => el['stock'] == Math.min(...selectSoup))[0]['name'],
        second: this.plates.filter(el => el['stock'] == Math.min(...selectSecond))[0]['name'],
        dessert: type == 'executive' ? this.plates.filter(el => el['stock'] == Math.min(...selectDessert))[0]['name'] : ''
      },
      index: this.order.length
    }
    this.order.push(newDish)
    this.selectablePlate = newDish
    this.total = this.order.map(el => el['price']).reduce((a, b) => a + b, 0);
  }
  
  printVoucher() {
    this.dialog.open(VoucherComponent)
  }

  selectedDish(plate) {
    if (this.selectablePlate) {
      let i = this.selectablePlate['index']
      if (this.selectablePlate['type'] == 'executive') {
        this.order[i]['plate'][plate['type']] = plate['name']
      } else {
        if (plate['type'] != 'dessert') {
          this.order[i]['plate'][plate['type']] = plate['name']
        }
      }

    }
  }

}

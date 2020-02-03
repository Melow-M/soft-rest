import { map, tap, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  otherList: boolean = false
  otherTitle: string = ''

  billView: boolean = true
  ticketView: boolean = false
  checketView: boolean = false

  cashView = true
  visaView = false
  masterCardView = false

  selectablePlate: any = null

  other = [
    {
      name: 'Coca Cola Personal 300ml',
      type: 'Otro',
      initialStock: 50,
      stock: 25,
      sold: 50,
      price: 1.5
    },
    {
      name: 'Coca Cola Personal 475ml',
      type: 'Otro',
      initialStock: 50,
      stock: 15,
      sold: 50,
      price: 3
    },
    {
      name: 'Trika Donofrio',
      type: 'Otro',
      initialStock: 50,
      stock: 10,
      sold: 50,
      price: 1.5
    },
    {
      name: 'Inka Cola 475ml',
      type: 'Otro',
      initialStock: 50,
      stock: 12,
      sold: 50,
      price: 3
    },
    {
      name: 'Casino Menta',
      type: 'Otro',
      initialStock: 50,
      stock: 9,
      sold: 50,
      price: 0.8
    },
    {
      name: 'Fanta 475ml',
      type: 'Otro',
      initialStock: 50,
      stock: 10,
      sold: 5,
      price: 3
    },

    {
      name: 'Sprite 475ml',
      type: 'Otro',
      initialStock: 50,
      stock: 5,
      sold: 5,
      price: 3
    },
    {
      name: 'Coca Cola 1lt',
      type: 'Otro',
      initialStock: 50,
      stock: 12,
      sold: 5,
      price: 3
    },
    {
      name: 'Inka Cola 1lt',
      type: 'Otro',
      initialStock: 50,
      stock: 12,
      sold: 5,
      price: 3
    },
    {
      name: 'Sprite 1lt',
      type: 'other',
      initialStock: 50,
      stock: 12,
      sold: 5,
      price: 3
    },
    {
      name: 'Fanta 475ml',
      type: 'other',
      initialStock: 50,
      stock: 10,
      sold: 5,
      price: 3
    },

    {
      name: 'Sprite 475ml',
      type: 'other',
      initialStock: 50,
      stock: 5,
      sold: 5,
      price: 3
    },
    {
      name: 'Coca Cola 1lt',
      type: 'other',
      initialStock: 50,
      stock: 12,
      sold: 5,
      price: 3
    },
    {
      name: 'Inka Cola 1lt',
      type: 'other',
      initialStock: 50,
      stock: 12,
      sold: 5,
      price: 3
    },
    {
      name: 'Sprite 1lt',
      type: 'other',
      initialStock: 50,
      stock: 12,
      sold: 5,
      price: 3
    }
  ]

  plates = [
    {
      name: 'Tequeños',
      type: 'entry',
      initialStock: 50,
      stock: 45,
      sold: 5
    },
    {
      name: 'Caldo Blanco',
      type: 'soup',
      initialStock: 30,
      stock: 24,
      sold: 6
    },
    {
      name: 'Caldo de Pollo',
      type: 'soup',
      initialStock: 20,
      stock: 20,
      sold: 0
    },
    {
      name: 'Lomo Saltado',
      type: 'second',
      initialStock: 50,
      stock: 1,
      sold: 49
    },
    {
      name: 'Ají de gallina',
      type: 'second',
      initialStock: 30,
      stock: 24,
      sold: 6
    },
    {
      name: 'Arroz Chaufa',
      type: 'second',
      initialStock: 20,
      stock: 20,
      sold: 0
    },
    {
      name: 'Gelatina',
      type: 'dessert',
      initialStock: 20,
      stock: 2,
      sold: 18
    },
    {
      name: 'Fruta',
      type: 'dessert',
      initialStock: 60,
      stock: 20,
      sold: 40
    }
  ]

  entry = this.plates.filter(el => el['type'] == 'entry')
  soup = this.plates.filter(el => el['type'] == 'soup')
  second = this.plates.filter(el => el['type'] == 'second')
  dessert = this.plates.filter(el => el['type'] == 'dessert')

  favorites = this.other.sort((a, b) => b['sold'] - a['sold']).slice(0, 5)
  others = this.other.filter(el => !this.favorites.includes(el))

  order: Array<any> = []

  total: number = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
  total$: Observable<number>

  pay = new FormControl('')
  change: number = 0
  change$: Observable<number>

  ticketForm: FormGroup
  billForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.createForm()
    this.change$ = this.pay.valueChanges.pipe(
      startWith(0),
      map(pay => {
        return pay - this.total
      }),
      tap(res => {
        if (res > 0) {
          this.change = Number(new Intl.NumberFormat('en', {
            maximumFractionDigits: 2,
            useGrouping: false
          }).format(res))
        } else {
          this.change = 0
        }
      })
    )

  }

  createForm() {
    this.ticketForm = this.fb.group({
      ruc: [''],
      name: [''],
      phone: ['']
    })
    this.billForm = this.fb.group({
      ruc: [''],
      businessName: [''],
      address: [''],
      phone: ['']
    })
  }
  cancelOrder() {
    this.order = []
    this.total = 0
  }

  firstOrder(type, price, name) {
    let selectEntry = this.plates.filter(el => el['type'] == 'entry' || el['type'] == 'soup').map(el => el['sold'])
    let selectSecond = this.second.map(el => el['sold'])
    let selectDessert = this.dessert.map(el => el['sold'])


    let newDish = {
      type: type,
      price: price,
      name: name,
      plate: {
        entry: this.plates.filter(el => el['sold'] == Math.max(...selectEntry))[0]['name'],
        second: this.plates.filter(el => el['sold'] == Math.max(...selectSecond))[0]['name'],
        dessert: type == 'executive' ? this.plates.filter(el => el['sold'] == Math.max(...selectDessert))[0]['name'] : ''
      },
      amount: 1,
      index: this.order.length
    }
    this.order.push(newDish)
    this.selectablePlate = newDish
    this.total = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
  }

  printVoucher() {
    console.log(this.order);

    this.dialog.open(VoucherComponent)
  }

  deleteDish(index) {
    if (index !== -1) {
      this.order.splice(index, 1);
      this.total = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
    }
  }

  deleteSubDish(index, type) {
    this.order[index]['plate'][type] = ''
  }

  selectedDish(plate) {
    if (plate['type'] == 'soup') {
      plate['type'] = 'entry'
    }
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

  addOrder(other) {
    let newDish = {
      ...other,
      amount: 1
    }
    let compare = this.order.map(el => el['name'])
    if (compare.includes(other['name'])) {
      let i = compare.indexOf(other['name'])
      this.order[i]['amount']++
    } else {
      this.order.push(newDish)

    }
    this.total = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
  }

}

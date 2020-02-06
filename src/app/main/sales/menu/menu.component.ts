import { Order } from './../../../core/models/sales/menu/order.model';
import { Grocery } from './../../../core/models/warehouse/grocery.model';
import { DatabaseService } from 'src/app/core/database.service';
import { map, tap, startWith, take, distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { VoucherComponent } from './voucher/voucher.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Meal } from 'src/app/core/models/sales/menu/meal.model';
import { Customer } from 'src/app/core/models/third-parties/customer.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  categoriesList: boolean = true
  MenuList: boolean = false
  generateSale: boolean = false
  otherList: boolean = false
  otherTitle: string = ''

  selectMenu: string = 'executive'
  billView: boolean = false
  ticketView: boolean = false
  checketView: boolean = true

  documentSerial$: Observable<any>
  documentSerial: string

  documentCorrelative$: Observable<any>
  documentCorrelative: any

  cashView = true
  visaView = false
  masterCardView = false

  selectablePlate: any = null

  others$: Observable<Grocery[]>
  other: Array<Grocery> = []

  plate$: Observable<Meal[]>
  plates: Array<Meal>
  entry: Array<Meal>
  soup: Array<Meal>
  second: Array<Meal>
  dessert: Array<Meal>


  favorites: Array<any> = []
  //favorites = this.other.sort((a, b) => b['sold'] - a['sold']).slice(0, 5)
  //others = this.other.filter(el => !this.favorites.includes(el))
  numberOrder$: Observable<number>
  order: Array<any> = []

  total: number = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
  total$: Observable<number>

  pay = new FormControl('')
  searchProduct = new FormControl('')
  change: number = 0
  change$: Observable<number>

  filteredCustomers$: Observable<any>

  selectedPay: any = 'checket'

  ticketForm: FormGroup
  billForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.createForm()

    this.filteredCustomers$ = combineLatest(
      this.dbs.getCustomers(),
      this.billForm.get('ruc').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())),
      this.billForm.get('businessName').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())),
      this.ticketForm.get('dni').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())),
      this.ticketForm.get('name').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([users, ruc, businessName, dni, name]) => {

        let userNatural = users.filter(el => el['type'] == 'NATURAL')
        let business = users.filter(el => el['type'] == 'EMPRESA')
        return {
          ruc: ruc ? business.filter(option => option['ruc'].toString().includes(ruc)) : business,
          dni: dni ? userNatural.filter(option => option['dni'].toString().includes(dni)) : userNatural,
          name: name ? userNatural.filter(option => option['name'].toLowerCase().includes(name)) : userNatural,
          businessName: businessName ? business.filter(option => option['businessName'].toLowerCase().includes(businessName)) : business,
        }
      })
    );

    this.plate$ = this.dbs.onGetDishes().pipe(
      tap(plates => {
        this.entry = plates.filter(el => el['type'] == 'ENTRADA' && !el['name'].includes('Caldo'))
        this.soup = plates.filter(el => el['type'] == 'ENTRADA' && el['name'].includes('Caldo'))
        this.second = plates.filter(el => el['type'] == 'FONDO')
        this.dessert = plates.filter(el => el['type'] == 'POSTRE')
        this.plates = plates
      })
    )
    this.numberOrder$ = this.dbs.getOrders().pipe(
      map(orders => {
        this.cancelOrder()
        return orders.length + 1
      })
    )

    this.documentCorrelative$ = this.dbs.getOrders().pipe(
      map(orders => {
        let billSerial = orders.filter(el => el['documentType'] == 'FACTURA').length + 1
        let ticketSerial = orders.filter(el => el['documentType'] == 'BOLETA').length + 1
        let checketSerial = orders.filter(el => el['documentType'] == 'TICKET').length + 1

        return {
          bill: ("000000" + billSerial).slice(-7),
          ticket: ("000000" + ticketSerial).slice(-7),
          checket: ("000000" + checketSerial).slice(-7)
        }

      }),
      tap(res => {
        this.documentCorrelative = res
      })
    )

    this.change$ = this.pay.valueChanges.pipe(
      startWith(1),
      map(pay => {
        if (this.total) {
          return pay - this.total
        } else {
          return 0
        }

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

    this.others$ =
      combineLatest(
        this.dbs.onGetOthers(),
        this.searchProduct.valueChanges.pipe(
          startWith(''),
          distinctUntilChanged(),
          debounceTime(800),
          map(res => {
            return res.trim().replace(/\s+/g, " ");
          }),
        )
      )
        .pipe(
          map(([product, search]) => {
            return product.filter(el => search ? el['name'].toLowerCase().includes(search.toLowerCase()) : true)
          })
        )


  }

  createForm() {
    this.ticketForm = this.fb.group({
      dni: [''],
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

  showRucCustomer(user): string | undefined {
    return user ? user['ruc'] : undefined;
  }
  showDniCustomer(user): string | undefined {
    return user ? user['dni'] : undefined;
  }
  showNameCustomer(user): string | undefined {
    return user ? user['name'] : undefined;
  }
  showBusinessNameCustomer(user): string | undefined {
    return user ? user['businessName'] : undefined;
  }

  chooseCustomer(){
    if(this.ticketForm.get('dni').value || this.ticketForm.get('name').value){
      let customer = this.ticketForm.get('dni').value?this.ticketForm.get('dni').value:this.ticketForm.get('name').value
      this.ticketForm.get('dni').setValue(customer)
      this.ticketForm.get('name').setValue(customer)
      this.ticketForm.get('phone').setValue(customer.phone)
    }

    if(this.billForm.get('ruc').value || this.billForm.get('businessName').value){
      let customer = this.billForm.get('ruc').value?this.billForm.get('ruc').value:this.billForm.get('businessName').value
      this.billForm.get('ruc').setValue(customer)
      this.billForm.get('businessName').setValue(customer)
      this.billForm.get('phone').setValue(customer.businessPhone)
      this.billForm.get('address').setValue(customer.businessAddress)
    }
    
  }
  cancelOrder() {
    this.MenuList = false;
    this.otherList = false
    this.categoriesList = true
    this.generateSale = false
    this.order = []
    this.total = 0
  }

  firstOrder(type: string, price: number, name: string) {
    this.selectMenu = type
    let selectEntry = this.plates.filter(el => el['type'] == 'ENTRADA').map(el => el['stock'])
    let selectSecond = this.second.map(el => el['stock'])
    let selectDessert = this.dessert.map(el => el['stock'])


    let newDish = {
      type: type,
      price: price,
      name: name,
      appetizer: type != 'second' ? this.plates.filter(el => el['stock'] == Math.min(...selectEntry) && el['type'] == 'ENTRADA')[0] : '',
      mainDish: this.plates.filter(el => el['stock'] == Math.min(...selectSecond) && el['type'] == 'FONDO')[0],
      dessert: type == 'executive' ? this.plates.filter(el => el['stock'] == Math.min(...selectDessert) && el['type'] == 'POSTRE')[0] : '',
      amount: 1,
      index: this.order.length
    }
    this.order.push(newDish)
    this.selectablePlate = newDish
    this.total = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
  }


  deleteDish(index) {
    if (index !== -1) {
      this.order.splice(index, 1);
      this.total = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
    }
  }

  deleteSubDish(index, type) {
    this.order[index][type] = ''
  }

  selectedDish(plate) {
    let typePlate = ''
    switch (plate['type']) {
      case 'ENTRADA': {
        typePlate = 'appetizer'
        break;
      }
      case 'FONDO': {
        typePlate = 'mainDish'
        break;
      }
      case 'POSTRE': {
        typePlate = 'dessert'
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
    if (this.selectablePlate) {
      let i = this.selectablePlate['index']
      if (this.selectMenu == 'executive') {
        this.order[i][typePlate] = plate
      } else {
        if (this.selectMenu == 'second') {
          if (typePlate == 'mainDish') {
            this.order[i][typePlate] = plate
          }
        } else {
          if (typePlate != 'dessert') {
            this.order[i][typePlate] = plate
          }
        }
      }



    }
  }

  addOrder(other) {
    let newDish = {
      ...other,
      amount: 1,
      index: this.order.length
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

  printVoucher() {

    let payOrder: Order = {
      id: '',
      orderCorrelative: 0,
      orderList: this.order,
      orderStatus: 'SELECCIONADO',
      price: 0,
      discount: 0,
      igv: 0,
      total: this.total,
      paymentType: this.cashView ? 'EFECTIVO' : this.visaView ? 'VISA' : 'MASTERCARD', // EFECTIVO, VISA, MASTERCARD
      amountReceived: this.pay.value,
      amountChange: this.change,
      documentType: this.billView ? 'FACTURA' : this.ticketView ? 'BOLETA' : 'TICKET', // FACTURA, BOLETA, TICKET
      documentSerial: this.billView ? 'FE001' : this.ticketView ? 'BE001' : 'T001', // FE001 ...
      documentCorrelative: this.documentCorrelative[this.selectedPay], // 0000124 ...
      customerId: '',
      canceledAt: null,
      canceledBy: null,
      createdAt: null,
      createdBy: null,
      editedAt: null,
      editedBy: null
    }


    this.dialog.open(VoucherComponent, {
      data: payOrder
    })


  }

}

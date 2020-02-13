import { Router } from '@angular/router';
import { AuthService } from './../../../core/auth.service';
import { Order } from './../../../core/models/sales/menu/order.model';
import { Grocery } from './../../../core/models/warehouse/grocery.model';
import { DatabaseService } from 'src/app/core/database.service';
import { map, tap, startWith, take, distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { VoucherComponent } from './voucher/voucher.component';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Meal } from 'src/app/core/models/sales/menu/meal.model';
import { Customer } from 'src/app/core/models/third-parties/customer.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {

  isOpening$: Observable<boolean>
  currentCash: any

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
  selectIndex: number = null

  others$: Observable<any>
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
  number: number
  order: Array<any> = []

  total: number = this.order.map(el => el['price'] * el['amount']).reduce((a, b) => a + b, 0);
  total$: Observable<number>

  pay = new FormControl('')
  searchProduct = new FormControl('')
  change: number = 0
  change$: Observable<number>

  filteredCustomersNatural$: Observable<any>
  filteredCustomersBusiness$: Observable<any>

  selectedPay: any = 'checket'

  ticketForm: FormGroup
  billForm: FormGroup

  menus$: Observable<any>

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dbs: DatabaseService,
    public auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm()

    this.menus$ = this.dbs.getMenu()

    this.isOpening$ = combineLatest(
      this.dbs.getCashes(),
      this.auth.user$
    ).pipe(
      map(([cashes, user]) => {
        this.currentCash = cashes.filter(el => el['open']).filter(el => el['currentOwnerId'] == user.uid)[0]
        let cashOpen = cashes.filter(el => el['open']).filter(el => el['currentOwnerId'] == user.uid)
        return cashOpen.length == 1
      }),
      tap(res => {
        if (!res) {
          this.router.navigateByUrl('/main/ventas/caja');
          this.snackbar.open('No se aperturó caja', 'Aceptar', {
            duration: 6000
          })
        }
      })
    )

    this.filteredCustomersNatural$ = combineLatest(
      this.dbs.getCustomers(),
      this.ticketForm.get('dni').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())),
      this.ticketForm.get('name').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([users, dni, name]) => {
        let userNatural = users.filter(el => el['type'] == 'NATURAL')
        return {
          dni: dni ? userNatural.filter(option => option['dni'].toString().includes(dni)) : userNatural,
          name: name ? userNatural.filter(option => option['name'].toLowerCase().includes(name.toLowerCase())) : userNatural
        }
      })
    );

    this.filteredCustomersBusiness$ = combineLatest(
      this.dbs.getCustomers(),
      this.billForm.get('ruc').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase())),
      this.billForm.get('businessName').valueChanges.pipe(
        filter(input => input !== null),
        startWith<any>(''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([users, ruc, businessName]) => {
        let business = users.filter(el => el['type'] == 'EMPRESA')
        return {
          ruc: ruc ? business.filter(option => option['ruc'].toString().includes(ruc)) : business,
          businessName: businessName ? business.filter(option => option['businessName'].toLowerCase().includes(businessName.toLowerCase())) : business,
        }
      })
    );

    this.plate$ = this.dbs.onGetDishes().pipe(
      tap(dishes => {
        let plates = dishes.filter(el => el['status'] == 'DISPONIBLE')
        this.entry = plates.filter(el => el['type'] == 'ENTRADA' && !el['name'].includes('Caldo'))
        this.soup = plates.filter(el => el['type'] == 'ENTRADA' && el['name'].includes('Caldo'))
        this.second = plates.filter(el => el['type'] == 'FONDO')
        this.dessert = plates.filter(el => el['type'] == 'POSTRE')
        this.plates = plates.map(el => {
          return {
            ...el,
            sold: el['initialStock'] - el['stock']
          }
        })
      })
    )

    this.numberOrder$ = this.dbs.getOrders().pipe(
      map(orders => {
        this.cancelOrder()
        this.number = orders.length + 1
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
          return pay - this.total ? pay - this.total : -1
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
        this.dbs.onGetOffer(),
        this.dbs.onGetCombo(),
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
          map(([product, offer, combo, search]) => {
            return {
              otros: product.filter(el => search ? el['name'].toLowerCase().includes(search.toLowerCase()) : true),
              promociones: offer.filter(el => search ? el['name'].toLowerCase().includes(search.toLowerCase()) : true),
              combos: combo.filter(el => search ? el['name'].toLowerCase().includes(search.toLowerCase()) : true)
            }
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
      ruc: ['', Validators.required],
      businessName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
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

  chooseCustomer() {
    if (this.ticketForm.get('dni').value || this.ticketForm.get('name').value) {
      let customer = this.ticketForm.get('dni').value ? this.ticketForm.get('dni').value : this.ticketForm.get('name').value
      this.ticketForm.get('dni').setValue(customer)
      this.ticketForm.get('name').setValue(customer)
      this.ticketForm.get('phone').setValue(customer.phone)
    }

    if (this.billForm.get('ruc').value || this.billForm.get('businessName').value) {
      let customer = this.billForm.get('ruc').value ? this.billForm.get('ruc').value : this.billForm.get('businessName').value
      this.billForm.get('ruc').setValue(customer)
      this.billForm.get('businessName').setValue(customer)
      this.billForm.get('phone').setValue(customer.businessPhone)
      this.billForm.get('address').setValue(customer.businessAddress)
    }

  }

  changetoBill() {
    this.billView = true
    this.ticketView = false
    this.checketView = false
    this.ticketForm.reset('')
  }

  cancelOrder() {
    this.MenuList = false;
    this.otherList = false
    this.categoriesList = true
    this.generateSale = false
    this.order = []
    this.total = 0
    this.ticketForm.reset()
    this.billForm.reset()
    this.pay.reset()
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
      amount: 1
    }
    this.order.push(newDish)
    this.selectablePlate = newDish
    this.selectIndex = this.order.length - 1
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
      let i = this.order.findIndex(el => el == this.selectablePlate)
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
    let customerId = ''
    if (this.billView) {
      if (this.billForm.get('businessName').value['id']) {
        customerId = this.billForm.get('businessName').value['id']
      } else {
        customerId = this.billForm.value
      }
    } else {
      if (this.ticketForm.get('name').value) {
        if (this.ticketForm.get('name').value['id']) {
          customerId = this.ticketForm.get('name').value['id']
        } else {
          customerId = this.ticketForm.value
        }
      }
    }

    let payOrder: Order = {
      id: '',
      orderCorrelative: ("0000" + this.number).slice(-5),
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
      customerId: customerId,
      cashId: this.currentCash['id'],
      openingId: this.currentCash['currentOpeningId'],
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

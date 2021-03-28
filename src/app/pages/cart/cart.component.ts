import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { OrderDialogComponent } from 'src/app/partials/order-dialog/order-dialog.component';
import { CartService } from './../../_services/cart.service';
import { SharedService } from './../../_services/shared.service';

@Component({
  selector: 'px-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit {

  @ViewChild('cartTable') cartTable: ElementRef;
  productList = [];
  displayedColumns = [
    'image',
    'name',
    'price',
    'amount',
    'totalPrice',
    'remove',
  ];

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.sharedService.productList$$.subscribe(productList => {
      this.productList = this.cartService.getCartProducts(productList);
    });
  }

  removeFromCart(id): void {
    this.cartService.removeFromCart(id);
    this.productList = this.productList
      .filter(product => product._id !== id);
  }

  sendOrder(): void {
    const list = this.productList;
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '600px',
      data: { list }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearCart();
      }
    });
  }


  exportPDF(): void {
    const list = this.productList;
    const doc = new jsPDF();
    const head = [['Proizvod', 'Kolicina', 'Iznos', 'Ukupno']];
    const body = this.productList.map(product => {
      const dataArray = [];
      dataArray.push(product.name);
      dataArray.push(this.showSinglePrice(product.price));
      dataArray.push(product.amount);
      dataArray.push(this.calculatePrice(product.amount, product.price));
      return dataArray;
    });
    const foot = [['', '', 'Ukupno: ', this.getTotalPrice()]];
    const tableOptions: UserOptions = { head, body, foot };
    autoTable(doc, tableOptions);
    const date = new Date();
    const dateStr =
      date.getFullYear() + '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2) + '-' +
      ('00' + date.getHours()).slice(-2) + '-' +
      ('00' + date.getMinutes()).slice(-2) + '-' +
      ('00' + date.getSeconds()).slice(-2);
    console.log('dateStr: ', dateStr);
    doc.save(`electrovision-${dateStr}.pdf`);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.productList = [];
  }


  calculatePrice(am, pr): string {
    const amount = this.rawPriceToNumber(am) || 1;
    const price = this.rawPriceToNumber(pr) || 0;
    if (price === 0) { return 'nema cene'; }
    return this.addDotsToPriceNumber(amount * price) + ' RSD';
  }

  showSinglePrice(rawPrice): string {
    const price = this.rawPriceToNumber(rawPrice) || 0;
    if (price === 0) { return 'nema cene'; }
    return this.addDotsToPriceNumber(price) + ' RSD';
  }

  rawPriceToNumber(rawPrice: string | number): number {
    if (!rawPrice) {
      return 0;
    }
    const price = rawPrice
      .toString()
      .replace('.', '')
      .replace(',', '')
      .replace(' ', '')
      .split(' ')[0];
    return parseInt(price, 10) || 0;
  }

  addDotsToPriceNumber(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  decreaseAmount(amount): number {
    const amountNumber = +amount;
    return amountNumber === 1 ? 1 : amountNumber - 1;
  }

  increaseAmount(amount): number {
    const amountNumber = +amount;
    return amountNumber + 1;
  }

  getTotalPrice(): string {
    let totalPrice = 0;
    this.productList?.forEach((product) => {
      let productTotal = (product.amount * this.rawPriceToNumber(product.price));
      if (Number.isNaN(productTotal)) {
        productTotal = 0;
      }
      totalPrice += productTotal;
    });
    return this.addDotsToPriceNumber(totalPrice) + ' RSD';
  }
}

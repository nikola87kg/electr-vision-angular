import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from 'src/app/partials/order-dialog/order-dialog.component';
import { CartService } from './../../_services/cart.service';
import { SharedService } from './../../_services/shared.service';

@Component({
  selector: 'px-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit {

  productList = [];

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
      this.filterProducts(productList);
    });
  }

  filterProducts(productList): void {
    const cartString = localStorage.getItem('new-cart');
    const cartArray = JSON.parse(cartString) || [];
    if (!productList) {
      return;
    }
    this.productList = productList?.filter(product => {
      const itemIndex = cartArray.findIndex(e => product._id in e);
      return itemIndex > -1;
    });
    this.productList.map(product => {
      const cartIndex = cartArray.findIndex(e => product._id in e);
      product.amount = cartArray[cartIndex][product._id] || 1;
      return product;
    })
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

  clearCart(): void {
    this.cartService.clearCart();
    this.productList = [];
  }


  calculatePrice(am, pr): string {
    const amount = this.rawPriceToNumber(am) || 1;
    const price = this.rawPriceToNumber(pr) || 0;
    if (price === 0) { return 'nema cene'; }
    return this.addDotsToPriceNumber(amount * price) + ' dinara';
  }

  showSinglePrice(rawPrice): string {
    const price = this.rawPriceToNumber(rawPrice) || 0;
    if (price === 0) { return 'nema cene'; }
    return this.addDotsToPriceNumber(price) + ' dinara';
  }

  rawPriceToNumber(rawPrice: string | number): number {
    const price = rawPrice
      .toString()
      .replace('.', '')
      .replace(',', '')
      .split(' ')[0];
    return parseInt(price, 10) || 0;
  }

  addDotsToPriceNumber(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
    return this.addDotsToPriceNumber(totalPrice) + ' dinara';
  }
}

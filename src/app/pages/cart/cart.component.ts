import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from 'src/app/partials/order-dialog/order-dialog.component';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'px-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit {

  productList = [];

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.get().subscribe(response => {
      this.filterProducts(response);
    });
  }

  filterProducts(response): void {
    const cartString = localStorage.getItem('cart');
    const cartArray = JSON.parse(cartString) || [];
    this.productList = response
      .filter(product => cartArray.includes(product._id));
    this.productList.forEach(product => product.amount = '1');
  }

  removeFromCart(id): void {
    const cartString = localStorage.getItem('cart');
    const cartArray: Array<any> = JSON.parse(cartString) || [];
    if (cartArray.includes(id)) {
      const ind = cartArray.indexOf(id);
      cartArray.splice(ind, 1);
      localStorage.setItem('cart', JSON.stringify(cartArray));
    }
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
    localStorage.clear();
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
    this.productList.forEach( (product) => {
      let productTotal = (product.amount * this.rawPriceToNumber(product.price));
      if (Number.isNaN(productTotal)) {
        productTotal = 0;
      }
      totalPrice += productTotal;
    });
    return this.addDotsToPriceNumber(totalPrice) + ' dinara';
  }
}

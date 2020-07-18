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


  calculatePrice(product): string {
    const amount = parseInt(product.amount, 2) || 1;
    const price = parseInt(product.price, 2) || 0;
    if (price === 0) { return 'nema cene'; }
    return (amount * price) + ' din';
  }

  showSinglePrice(rawPrice): string {
    const price = parseInt(rawPrice, 2) || 0;
    if (price === 0) { return 'nema cene'; }
    return price + ' din';
  }

}

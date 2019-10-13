import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/_services/products.service';
import { MatDialog } from '@angular/material';
import { OrderDialogComponent } from 'src/app/partials/order-dialog/order-dialog.component';

@Component({
  selector: 'cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit {

  productList = [];

  constructor(
    public dialog: MatDialog,
    private productService: ProductsService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.get().subscribe(response => {
      this.filterProducts(response);
    });
  }

  filterProducts(response) {
    let cartString = localStorage.getItem('cart');
    let cartArray = JSON.parse(cartString) || [];
    this.productList = response
      .filter(product => cartArray.includes(product._id));
    this.productList.forEach(product => product.amount = '1');
  }

  removeFromCart(id) {
    let cartString = localStorage.getItem('cart');
    let cartArray: Array<any> = JSON.parse(cartString) || [];
    if (cartArray.includes(id)) {
      const ind = cartArray.indexOf(id);
      cartArray.splice(ind, 1);
      localStorage.setItem('cart', JSON.stringify(cartArray));
    }
    this.productList = this.productList
      .filter(product => product._id !== id);
  }

  sendOrder() {
    const list = this.productList;
    console.log(list)
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '300px',
      data: { list }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clearCart();
      }
    });
  }

  clearCart() {
    localStorage.clear();
    this.productList = [];
  }


  calculatePrice(product) {
    let amount = parseInt(product.amount) || 1;
    let price = parseInt(product.price) || 0;
    if (price === 0) return 'nema cene';
    return (amount * price) + ' din';
  }

  showSinglePrice(rawPrice) {
    let price = parseInt(rawPrice) || 0;
    if (price === 0) return 'nema cene';
    return price + ' din';
  }

}

/* Angular */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './../partials/snackbar/snackbar.component';

/* BRAND SERVICE */
@Injectable({ providedIn: 'root' })
export class CartService {

    constructor(private snackBar: MatSnackBar) { }

    addToCart(id, count = 1): void {
        const cartString = localStorage.getItem('new-cart');
        const cartArray = JSON.parse(cartString) || [];
        if (cartArray.some(e => id in e)) {
            this.openSnackBar({ action: 'new-cart', type: 'exist' });
            return;
        }
        cartArray.push({ [id]: count });
        localStorage.setItem('new-cart', JSON.stringify(cartArray));
        this.openSnackBar({ action: 'new-cart', type: 'new' });
    }

    removeFromCart(id): void {
        const cartString = localStorage.getItem('new-cart');
        const cartArray: Array<any> = JSON.parse(cartString) || [];
        const itemIndex = cartArray.findIndex(e => id in e);
        if (itemIndex > -1) {
            cartArray.splice(itemIndex, 1);
            localStorage.setItem('new-cart', JSON.stringify(cartArray));
        }
    }


    clearCart(): void {
        localStorage.removeItem('new-cart');
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 3000,
            data: object,
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { OrderDialogComponent } from './partials/order-dialog/order-dialog.component';
import { CategoriesService } from './_services/categories.service';
import { ProductsService } from './_services/products.service';
import { SharedService } from './_services/shared.service';

@Component({
    selector: 'px-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private productService: ProductsService,
        public categoryService: CategoriesService,
        public sharedService: SharedService
    ) { }

    isAdminPanel = false;

    ngOnInit(): void {
        this.getAllProducts();
        this.getAllCategories();
        this.handleRouting();
        this.setCart();
    }

    setCart(): void {
        const cart = localStorage.getItem('cart');
        const cartArray = JSON.parse(cart);
        if (!Array.isArray(cartArray)) {
            localStorage.setItem('cart', '[]');
        }
    }

    handleRouting(): void {
        this.router.events
            .subscribe(evt => {
                if (evt instanceof NavigationEnd) {
                    document.body.scrollTop = 0;
                }
                const pathArray = window.location.pathname.split('/');
                const firstPath = pathArray[1];
                if (firstPath === 'admin') {
                    this.isAdminPanel = true;
                } else {
                    this.isAdminPanel = false;
                }
            });
    }

    getAllProducts(): void {
        this.productService.get().subscribe((response) => {
            this.sharedService.productList.next(response);
        });
    }

    getAllCategories(): void {
        this.categoryService.get().subscribe((response) => {
            this.sharedService.categoryList.next(response);
        });
    }

    sendMessage(): void {
        this.dialog.open(OrderDialogComponent, {
            width: '600px',
        });
    }
}

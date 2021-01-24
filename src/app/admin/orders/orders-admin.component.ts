import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderInterface, OrderService } from 'src/app/_services/order.service';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { SharedService } from '../../_services/shared.service';

/* Decorator */
@Component({
    selector: 'px-orders-admin',
    templateUrl: './orders-admin.component.html'
})

export class OrdersAdminComponent implements OnInit {

    /* Constructor */
    constructor(
        private orderService: OrderService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) { }

    orderList: Array<OrderInterface> = [];
    displayedColumns = ['position', 'name', 'phone', 'email', 'address', 'question', 'new-cart', 'delete'];

    screenSize;
    currentIndex: number;
    dataSource;

    isAddDialogOpen: boolean;
    isDialogEditing: boolean;
    dialogTitle: string;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    /* INIT */
    ngOnInit(): void {
        this.sharedService.screenSize$$.subscribe(
            (result => this.screenSize = result)
        );
        this.getOrders();
    }

    /* Delete Order */
    deleteOrder(id): void {
        this.orderService.delete(id).subscribe(
            (data) => {
                this.orderList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.orderList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.openSnackBar({
                    action: 'delete2',
                    type: 'order'
                });
            }
        );
    }

    /* Get Orders */
    getOrders(): void {
        this.orderService.get().subscribe(response => {
            this.orderList = response;
            this.dataSource = new MatTableDataSource(this.orderList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: object,
        });
    }
}

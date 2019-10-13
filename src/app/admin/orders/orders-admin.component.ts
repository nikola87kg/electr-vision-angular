/* Angular */
import { Component, OnInit, ViewChild } from '@angular/core';

/* Services */
import { OrderService, OrderInterface } from 'src/app/_services/order.service';

/* Material */
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SharedService } from '../../_services/shared.service';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';

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

    orderList: Array<OrderInterface> = [];;
    displayedColumns = ['position', 'name', 'phone', 'email', 'address', 'question', 'cart', 'delete'];;

    screenSize;
    currentIndex: number;
    dataSource;

    isAddDialogOpen: boolean;
    isDialogEditing: boolean;
    dialogTitle: string;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    /* INIT */
    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.getOrders();
    }

    /* Delete Order */
    deleteOrder(id) {
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
    getOrders() {
        this.orderService.get().subscribe(response => {
            this.orderList = response;
            this.dataSource = new MatTableDataSource(this.orderList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    /* Snackbar */
    openSnackBar(object) {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: object,
        });
    }
}

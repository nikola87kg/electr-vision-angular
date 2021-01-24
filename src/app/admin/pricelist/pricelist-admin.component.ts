import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { PricelistInterface, PricelistService } from '../../_services/pricelist.service';
import { SharedService } from '../../_services/shared.service';
import { PriceGroupInterface } from './../../_services/pricelist.service';

/* Decorator */
@Component({
    selector: 'px-pricelist-admin',
    templateUrl: './pricelist-admin.component.html'
})

export class PricelistAdminComponent implements OnInit {

    /* Constructor */
    constructor(
        private pricelistService: PricelistService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) { }

    faTimes = faTimes;

    pricelist: PricelistInterface;
    pricelistList: Array<PricelistInterface>;
    displayedColumns = ['position', 'name', 'priceGroup', 'price'];
    priceGroups: PriceGroupInterface[] = [];

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
        this.fillPriceGroups();
        this.getPricelists();
    }

    /* Dialog  */
    openDialog(editing, singlePricelist?, index?): void {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje stavke';
            this.pricelist = Object.assign({}, singlePricelist);
            if (index) {
                this.currentIndex = index;
            }
        }
        if (!editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = false;
            this.dialogTitle = 'Dodavanje stavke';
            this.clearForm();
        }
    }

    closeDialog(event): void {
        event.stopPropagation();
        this.isAddDialogOpen = false;
        this.clearForm();
    }

    clearForm(): void {
        this.pricelist = {
            _id: '',
            name: '',
            priceGroup: undefined,
            price: '',
            createdAt: null
        };
    }

    /* PriceGroups */
    fillPriceGroups(): void {
        this.pricelistService.getPriceGroups().subscribe(
            (response) => {
                this.priceGroups = response;
            }
        );
    }

    /* Add new pricelist */
    postPricelist(pricelist, event): void {
        this.pricelistService.post(pricelist).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getPricelists();
                this.openSnackBar({
                    action: 'create2',
                    type: 'pricelist'
                });
            }
        );
    }

    /* Update pricelist */
    putPricelist(pricelist, event): void {
        this.pricelistService.put(pricelist._id, pricelist).subscribe(
            (data) => {
                this.closeDialog(event);
                this.getPricelists();
                this.openSnackBar({
                    action: 'update2',
                    type: 'pricelist'
                });
            }
        );
    }

    /* Delete Pricelist */
    deletePricelist(id, event): void {
        this.pricelistService.delete(id).subscribe(
            (data) => {
                this.pricelistList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.pricelistList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete2',
                    type: 'pricelist'
                });
            }
        );
    }

    /* Get pricelist */
    getPricelists(): void {
        this.pricelistService.get().subscribe(response => {
            this.pricelistList = response;
            this.dataSource = new MatTableDataSource(this.pricelistList);
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

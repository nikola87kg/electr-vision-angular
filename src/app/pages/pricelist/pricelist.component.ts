import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { SharedService } from '../../_services/shared.service';
import { PricelistService } from '../../_services/pricelist.service';

interface PricelistModel {
    _id: string;
    name: string;
    description: string;
    price: string;
    createdAt: Date;
}

export const PricelistColumnsUser = [ 'position', 'name', 'description', 'price' ];
@Component({
    selector: 'px-pricelist',
    templateUrl: './pricelist.component.html',
    styleUrls: ['./pricelist.component.scss']
})

export class PricelistComponent implements OnInit {

    /* Constructor */
    constructor(
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
        public pricelistService: PricelistService
    ) {}

    pricelist: PricelistModel;
    displayedColumns = PricelistColumnsUser;

    screenSize;
    pricelistList: Array<PricelistModel>;
    dataSource;

    /* INIT */
    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.getPricelists();
    }


    /* Get pricelist */
    getPricelists() {
        this.pricelistService.get().subscribe(response => {
            this.pricelistList = response.object;
            this.dataSource = new MatTableDataSource(this.pricelistList);
        });
    }

}

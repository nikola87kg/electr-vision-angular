import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { SharedService } from '../../_services/shared.service';
import { PricelistService, PricelistInterface } from '../../_services/pricelist.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-pricelist',
    templateUrl: './pricelist.component.html',
    styleUrls: ['./pricelist.component.scss']
})

export class PricelistComponent implements OnInit {

    constructor( public title: Title,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
        public pricelistService: PricelistService
    ) {
        title.setTitle('Cenovnik proizvoda i usluga | ElectroVision Kragujevac');
    }

    pricelist: PricelistInterface;
    pricelistList: Array<PricelistInterface>;
    displayedColumns = [ 'position', 'name', 'description', 'price' ];

    screenSize;
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
            this.pricelistList = response;
            this.dataSource = new MatTableDataSource(this.pricelistList);
        });
    }

}

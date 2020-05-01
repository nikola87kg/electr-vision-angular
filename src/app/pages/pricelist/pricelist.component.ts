import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { SharedService } from '../../_services/shared.service';
import { PricelistService, PricelistInterface, PriceGroupInterface } from '../../_services/pricelist.service';
import { Title } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';

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
    priceGroups: Array<PriceGroupInterface> = [];
    displayedColumns = [ 'name', 'price' ];

    screenSize;
    dataSource = [];

    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.getPriceGroups();
    }

    getPricelists(groups: PriceGroupInterface[]) {
        this.pricelistService.get().subscribe(response => {
            this.pricelistList = response;
            for (const key in groups) {
                if (groups.hasOwnProperty(key)) {
                    const element: PriceGroupInterface = groups[key];
                    this.dataSource.push(
                        new MatTableDataSource(
                            response.filter( el =>  el.priceGroup._id == element._id)
                        )
                    );
                }
            }
        });
    }

    getPriceGroups() {
        this.pricelistService.getPriceGroups().subscribe(response => {
            this.priceGroups = response;
            this.getPricelists(response);
        });
    }

}

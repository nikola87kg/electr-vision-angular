import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { PriceGroupInterface, PricelistInterface, PricelistService } from '../../_services/pricelist.service';
import { SharedService } from '../../_services/shared.service';

@Component({
    selector: 'px-pricelist',
    templateUrl: './pricelist.component.html',
    styleUrls: ['./pricelist.component.scss']
})

export class PricelistComponent implements OnInit {

    constructor(public title: Title,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
        public pricelistService: PricelistService
    ) {
        title.setTitle('Cenovnik proizvoda i usluga | ElectroVision Kragujevac');
    }

    pricelist: PricelistInterface;
    pricelistList: Array<PricelistInterface>;
    priceGroups: Array<PriceGroupInterface> = [];
    displayedColumns = ['name', 'price'];

    screenSize;
    dataSource = [];

    ngOnInit(): void {
        this.sharedService.screenSize$$.subscribe(
            (result => this.screenSize = result)
        );
        this.getPriceGroups();
    }

    getPricelists(groups: PriceGroupInterface[]): void {
        this.pricelistService.get().subscribe(response => {
            this.pricelistList = response;
            for (const key in groups) {
                if (groups.hasOwnProperty(key)) {
                    const element: PriceGroupInterface = groups[key];
                    this.dataSource.push(
                        new MatTableDataSource(
                            response.filter(el => el.priceGroup._id === element._id)
                        )
                    );
                }
            }
        });
    }

    getPriceGroups(): void {
        this.pricelistService.getPriceGroups().subscribe(response => {
            this.priceGroups = response;
            this.getPricelists(response);
        });
    }

}

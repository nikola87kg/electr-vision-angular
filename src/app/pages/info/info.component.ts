import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../_services/shared.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit {

    constructor( public title: Title,
        public sharedService: SharedService,
    ) {
        title.setTitle('Informacije | ElectroVision Kragujevac');
    }

    screenSize;
    dataSource;

    /* INIT */
    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
    }


}

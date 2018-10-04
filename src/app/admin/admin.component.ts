import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'px-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

    wideMenu = localStorage.getItem('sidebarOpen') || 'closed';
    screenSize = null;

    constructor( public sharedService: SharedService ) {}

    ngOnInit() {
        this.checkWidth();
        this.sharedService.screenSize.next(this.screenSize);
    }

    @HostListener('window:resize', ['$event']) onResize(event) {
        const innerWidth = event.target.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        this.sharedService.screenSize.next(this.screenSize);
    }

    togleMenu() {
        const sidebar = localStorage.getItem('sidebarOpen');
        if (sidebar === 'open') {
            localStorage.setItem('sidebarOpen', 'closed');
            this.wideMenu = 'closed';
        } else {
            localStorage.setItem('sidebarOpen', 'open');
            this.wideMenu = 'open';
        }
    }

    checkWidth() {
        const innerWidth = window.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        this.sharedService.screenSize.next(this.screenSize);
    }

}

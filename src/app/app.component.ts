import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'px-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(private router: Router, ) {
    }

    isAdminPanel = false;

    ngOnInit() {
        this.router.events
            .subscribe( evt => {
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
}

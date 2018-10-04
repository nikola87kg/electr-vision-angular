import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(private router: Router, private title: Title , private route:ActivatedRoute) {
        router.events.pipe(
            filter(e => e instanceof NavigationEnd)
        )
        .forEach(e => {
            let titleData = route.root.firstChild.snapshot.data['title']
            if(!titleData) {
                const arrayURL = this.router.url.split('/');
                const lastItemURL = arrayURL[arrayURL.length - 1];
                titleData = lastItemURL;
            }
            title.setTitle(titleData + ' | Electrovision Kragujevac');
        });
    }

    isAdminPanel = false;

    ngOnInit() {
        this.router.events
            .subscribe( evt => {
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

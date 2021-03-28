import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SharedService } from '../../_services/shared.service';
import { facebookLink, gmailLink, instagramLink, youtubeLink } from './../../_services/global-config';


declare var $: any;

@Component({
    selector: 'px-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    gmailLink = gmailLink;
    youtubeLink = youtubeLink;
    instagramLink = instagramLink;
    facebookLink = facebookLink;

    showResult = false;
    searchInput = new FormControl();
    options = [];
    products = [];
    filteredOptions$: Observable<any[]>;
    screenSize = null;

    @HostListener('window:resize', ['$event']) onResize(event): void {
        const innerWidth = event.target.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        this.sharedService.screenSize$$.next(this.screenSize);
    }


    constructor(
        private router: Router,
        public sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.getAllProductsAndFilter();
        this.checkWidth();
        this.sharedService.screenSize$$.next(this.screenSize);
    }

    private filterSearchResult(searchInputValue: string): any[] {
        return this.options.filter(
            option => (`${option.name} ${option.catalog}`)
                .toLowerCase()
                .indexOf(searchInputValue.toLowerCase()) !== -1
        );
    }

    getAllProductsAndFilter(): void {
        this.sharedService.productList$$.subscribe(result => {
            if (result) {
                this.options = result;
                this.filteredOptions$ = this.searchInput.valueChanges.pipe(
                    startWith(''),
                    map(value => this.filterSearchResult(value))
                );
            }
        });
    }

    goToProduct(slug): void {
        this.showResult = false;
        this.router.navigate(['/proizvod/' + slug]);
    }

    goToProductByName(name): void {
        const product = this.options.filter(option => option.name === name)[0];
        this.router.navigate(['/proizvod/' + product.slug]);
    }

    checkWidth(): void {
        const innerWidth = window.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        this.sharedService.screenSize$$.next(this.screenSize);
    }

}

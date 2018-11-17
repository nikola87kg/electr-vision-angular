import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ProductsService } from '../../_services/products.service';
import { SharedService } from '../../_services/shared.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

declare var $: any;

@Component({
    selector: 'px-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(
        private productService: ProductsService,
        private router: Router,
        public sharedService: SharedService
    ) {}

    showResult = false;

    searchInput = new FormControl();
    options = [];
    products = [];
    filteredOptions: Observable<any[]>;
    screenSize = null;

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

    ngOnInit() {
        this.checkWidth();
        this.sharedService.screenSize.next(this.screenSize);
        this.getAllProducts();
        setTimeout(() => {
            this.filteredOptions = this.searchInput.valueChanges.pipe(
                startWith(''),
                map( value => this._filter(value) )
            );
        }, 500);
    }

    private _filter(value: string): string[] {
        const lcValue = value.toLowerCase();
        return this.options.filter(
            option => option.name.toLowerCase().indexOf(lcValue) === 0
        );
    }

    getAllProducts() {
        this.productService.get().subscribe( (result) => {
            this.options = result
        });
    }

    goToProduct(slug) {
        this.showResult = false;
        this.router.navigate(['/proizvod/' + slug]);
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

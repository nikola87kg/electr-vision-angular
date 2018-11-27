import { Component, OnInit } from '@angular/core';
import { BrandsService } from '../../_services/brands.service';
import { Router } from '@angular/router';

@Component({
    selector: 'px-brand-roller',
    templateUrl: './brand-roller.component.html',
    styleUrls: ['./brand-roller.component.scss']
})
export class BrandRollerComponent implements OnInit {

    brandList = [];
    placeholders = {
        p0: '',
        p1: '',
        p2: '',
        p3: '',
        p4: '',
    }

    constructor(
        private brandService: BrandsService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getBrands();
    }

    /* Get brand */
    getBrands() {
        let currentPage = 0;
        this.brandService.get().subscribe(response => {
            this.brandList = response.filter(brand => brand.vip);
            this.brandList.forEach( (brand, index) => {
                    this.placeholders['p' + index] = brand;
            });
            setInterval(() => {
                this.brandList.forEach( (brand, index) => {
                    if(index < this.brandList.length) {
                        this.placeholders['p' + (index + currentPage)] = brand;
                    }
                    currentPage ++;
                })
            }, 1000)
        });
    }

    /* Navigation */
    goToBrand(slug) {
        this.router.navigate(
            ['/pretraga/kategorije/sve'], 
            {queryParams: { brand: slug } } 
        );
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandsService } from '../../_services/brands.service';

interface BrandPlaceholder {
    image: string;
    slug: string;
}

@Component({
    selector: 'px-brand-roller',
    templateUrl: './brand-roller.component.html',
    styleUrls: ['./brand-roller.component.scss'],
})

export class BrandRollerComponent implements OnInit {

    brandList = [];
    placeholders: BrandPlaceholder[] = [];
    myState = 'state1';

    constructor(
        private brandService: BrandsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getBrands();
    }

    /* Get brand */
    getBrands(): void {
        this.brandService.get().subscribe(response => {
            this.brandList = response
                .filter(brand => brand.vip);
            /* fill placeholders */
            this.brandList.forEach((brand, index) => {
                this.placeholders[index] = brand;
            });
            /* change placeholder after timeout */
            setInterval(() => {

                let oldplaceholder;
                this.placeholders.forEach((placeholder, index) => {
                    if (index < this.brandList.length - 1) {
                        if (index === 0) {
                            oldplaceholder = this.placeholders[0];
                        }
                        this.placeholders[index] = this.placeholders[index + 1];
                    } else {
                        this.placeholders[index] = oldplaceholder;
                    }
                });

            }, 2000);
        });
    }

    /* Navigation */
    goToBrand(slug): void {
        this.router.navigate(
            ['/pretraga/kategorije/sve'],
            { queryParams: { brand: slug } }
        );
    }
}

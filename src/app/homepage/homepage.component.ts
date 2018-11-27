/* Angular */
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

/* Services */
import { BrandsService } from '../_services/brands.service';
import { CategoriesService } from '../_services/categories.service';
import { ProductsService } from '../_services/products.service';
import { SharedService } from '../_services/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({transform: 'translateX(100%)'}),
                    animate('2s 2s', style({transform: 'translateX(0)'}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)'}),
                    animate('2s 2s', style({transform: 'translateX(-100%)'}))
                ])
            ],
        ),
        trigger(
            'leaveAnimation', [
                transition(':leave', [
                    style({transform: 'translateX(0)'}),
                    animate('2s 0s', style({transform: 'translateX(-100%)'}))
                ])
            ],
        ),
    ],
})
export class HomepageComponent implements OnInit {
    productList = [];
    brandList = [];
    navItemsVisible = false;
    screenSize;
    currentSlider = 1;
    firstSlideOn = true;
    maxItems = 4;
    banners = [
        {
            title: 'Ugradnja kamera',
            content: 'Nudimo kamere vrhunskog kvaliteta.',
            imageUrl: './assets/baner/baner1.jpg'
        },
        {
            title: 'Ugradnja alarma',
            content: 'Ugrađujemo moderne alarme.',
            imageUrl: './assets/baner/baner2.jpg'
        },
        {
            title: 'Video nadzor',
            content: 'Najbolji video nadzor u gradu!',
            imageUrl: './assets/baner/baner3.jpg'
        }
    ];

    constructor(
        private brandService: BrandsService,
        private productService: ProductsService,
        public sharedService: SharedService,
        public title: Title,
        private router: Router) { 
            title.setTitle('ElectroVision Kragujevac');
        }

    ngOnInit() {
        this.getBrands();
        this.getProducts();
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        if(this.screenSize === "large") {
            this.maxItems = 3;
        } else {
            this.maxItems = 4;
        }
        setInterval( () => {
            this.rollSlides();
        }, 5000 );
        setTimeout( () => {
            this.firstSlideOn = false;
        }, 2200 );
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
        if(this.screenSize === "large") {
            this.maxItems = 3;
        } else {
            this.maxItems = 4;
        }
        this.sharedService.screenSize.next(this.screenSize);
    }
    
    /* Carousel */
    rollSlides() {
        const sliderIndex = this.currentSlider;
        const bannersLength = this.banners.length;
        if (sliderIndex < bannersLength - 1) {
            this.currentSlider++;
        } else {
            this.currentSlider = 0;
        }
    }


    /* Get products + filter */
    getProducts() {
        this.productService.get().subscribe(response => {
            this.productList = response.filter(item => item.vip);
        });
    }

    /* Get brand */
    getBrands() {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
        });
    }

    /* Navigation */
    goToCategory(slug) {
        this.router.navigate( ['/pretraga/potkategorije/' + slug] );
    }

    goToGroup(slug) {
        this.router.navigate( ['/pretraga/proizvodi/' + slug] );
    }

    goToBrand(slug) {
        this.router.navigate(
            ['/pretraga/kategorije/sve'], 
            {queryParams: { brand: slug } } 
        );
    }

    goToProduct(slug, newTab?) {
        if (newTab) {
             window.open('/proizvod/' + slug);
        } else {
            this.router.navigate(['/proizvod/' + slug]);
        }
    }

}

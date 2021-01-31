import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { SeoService } from '../_services/seo.service';
/* Services */
import { SharedService } from '../_services/shared.service';
import { SlidesService } from '../_services/slides.service';
import { CartService } from './../_services/cart.service';


@Component({
    selector: 'px-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    animations: [
        trigger(
            'allBanners', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('1s 3s', style({ transform: 'translateX(0)' }))
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0)' }),
                animate('1s 3s', style({ transform: 'translateX(-100%)' }))
            ])
        ],
        ),
        trigger(
            'firstBanner', [
            transition(':leave', [
                style({ transform: 'translateX(0)' }),
                animate('1s 1s', style({ transform: 'translateX(-100%)' }))
            ])
        ],
        ),
    ],
})
export class HomepageComponent implements OnInit {
    faMapMarker = faMapMarkerAlt;
    vipProducts = [];
    vipProductsVisible = [];
    brandList = [];
    navItemsVisible = false;
    screenSize;
    currentSlider = 1;
    firstSlideOn = true;
    maxItems = 3;
    currentRoll = 0;
    showSlides = false;
    banners = [];
    @ViewChild('myCarousel') myCarousel: NguCarousel<any>;
    carouselConfig: NguCarouselConfig = {
        grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
        load: 3,
        interval: { timing: 4000, initialDelay: 0 },
        loop: true,
        touch: true,
        speed: 2000,
    };


    constructor(
        public sharedService: SharedService,
        public slideService: SlidesService,
        private cartService: CartService,
        private router: Router,
        private seo: SeoService,
        public snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        this.getSlides();
        this.getProducts();

        /* SEO */
        this.seo.generateTags({
            title: 'Dobro došli',
            description: 'Početna stranica',
            image: 'http://electrovision.rs/assets/logo/ElectroVision.svg',
            slug: 'pocetna'
        });

        /* Screen Service */

        this.sharedService.screenSize$$.subscribe(
            (result => this.screenSize = result)
        );

        if (this.screenSize === 'large') {
            this.maxItems = 3;
        } else { this.maxItems = 4; }
    }

    @HostListener('window:resize', ['$event']) onResize(event): void {
        const innerWidth = event.target.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        if (this.screenSize === 'large') {
            this.maxItems = 3;
        } else {
            this.maxItems = 4;
        }
        this.sharedService.screenSize$$.next(this.screenSize);
    }


    /* Get products + filter */
    getProducts(): void {
        this.sharedService.productList$$.subscribe(productsResponse => {
            if (productsResponse) {
                this.vipProducts = productsResponse.filter(item => item.vip);
                this.vipProductsVisible = this.vipProducts.slice(0, this.maxItems);

                /* change placeholder after timeout */
                setInterval(() => {
                    if (this.currentRoll === 1 && this.maxItems === 4) {
                        this.currentRoll = 0;
                    } else if (this.currentRoll === 2) {
                        this.currentRoll = 0;
                    } else {
                        this.currentRoll++;
                    }
                    this.vipProductsVisible =
                        this.vipProducts.slice((this.currentRoll * this.maxItems), (this.currentRoll * this.maxItems + this.maxItems));
                }, 5000);
            }
        });
    }

    getSlides(): void {
        this.slideService.get().subscribe(result => {
            if (result && result.length > 1) {
                this.showSlides = true;
                this.banners = result;
            }
        });
    }

    /* Navigation */
    goToCategory(slug): void {
        this.router.navigate(['/pretraga/potkategorije/' + slug]);
    }

    goToGroup(slug): void {
        this.router.navigate(['/pretraga/proizvodi/' + slug]);
    }

    goToBrand(slug): void {
        this.router.navigate(
            ['/pretraga/kategorije/sve'],
            { queryParams: { brand: slug } }
        );
    }

    goToProduct(slug, newTab?): void {
        if (newTab) {
            window.open('/proizvod/' + slug);
        } else {
            this.router.navigate(['/proizvod/' + slug]);
        }
    }

    addToCart(e, id): void {
        e.stopPropagation();
        this.cartService.addToCart(id, 1);
    }

}

/* Angular */
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

/* Services */
import { SharedService } from '../_services/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { SeoService } from '../_services/seo.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '../partials/snackbar/snackbar.component';

@Component({
    selector: 'px-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    animations: [
        trigger(
            'allBanners', [
                transition(':enter', [
                    style({transform: 'translateX(100%)'}),
                    animate('1s 3s', style({transform: 'translateX(0)'}))
                ]),
                transition(':leave', [
                    style({transform: 'translateX(0)'}),
                    animate('1s 3s', style({transform: 'translateX(-100%)'}))
                ])
            ],
        ),
        trigger(
            'firstBanner', [
                transition(':leave', [
                    style({transform: 'translateX(0)'}),
                    animate('1s 1s', style({transform: 'translateX(-100%)'}))
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
            title: 'Kontrola pristupa',
            content: 'Bez muke i ključa sve na šifru i otisak prsta',
            imageUrl: './assets/baner/baner1.jpg'
        },
        {
            title: 'Motori za kapije i rampe',
            content: 'Najsavremeniji motori sa italijanskom tehnologijom',
            imageUrl: './assets/baner/baner2.jpg'
        },
        {
            title: 'Video nadzor',
            content: 'Sigurnost na prvom mestu brend br. 1 u svetu - HikVision',
            imageUrl: './assets/baner/baner3.jpg'
        }
    ];

    constructor(
        public sharedService: SharedService,
        private router: Router,
        private seo: SeoService,
        public snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
        this.getProducts();

        /* SEO */
        this.seo.generateTags( {
            title: 'Dobro došli',
            description: 'Početna stranica',
            image: 'http://electrovision.rs/assets/logo/ElectroVision.svg',
            slug: 'pocetna'
        })

        /* Screen Service */

        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );

        if(this.screenSize === "large") { this.maxItems = 3; 
        } else { this.maxItems = 4; }

        /* Slider */
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
            this.sharedService.productList.subscribe( result => {
            if(result) {
                this.productList = result.filter(item => item.vip);
            } else {
                setTimeout( ()=> {
                    this.getProducts()
                }, 1)
            }
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

    addToCart(id, e) {
        e.stopPropagation();
        let cartString = localStorage.getItem('cart');
        let cartArray = JSON.parse(cartString) || [];
        if (id && cartArray && !cartArray.includes(id)) {
          cartArray.push(id);
          localStorage.setItem('cart', JSON.stringify(cartArray));
          this.openSnackBar({action: 'cart',type: 'new'});
        } else {
          this.openSnackBar({action: 'cart',type: 'exist'});
        }
      }

      /* Snackbar */
      openSnackBar(object) {
        this.snackBar.openFromComponent(SnackbarComponent, {
          duration: 3000,
          data: object,
        });
      }

}

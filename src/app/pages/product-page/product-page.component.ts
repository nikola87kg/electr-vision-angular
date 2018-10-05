import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ProductsService } from '../../_services/products.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
    product = {
        name: '',
        description: '',
        image: '',
        group: {
            name: '',
            slug: ''
        },
        brand: {
            name: '',
            slug: ''
        },
        category: {
            name: '',
            slug: ''
        }
    };
    productList = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private productService: ProductsService,
        private router: Router,
        private title: Title
    ) {
        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.getProduct();
                this.getProducts();
            }
        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.getProduct();
            this.getProducts();
        }, 1);
    }

    /* Navigation */
    goToBrand(slug) {
        this.router.navigate(['/brend/' + slug]);
    }
    goToProduct(slug) {
        this.router.navigate(['/proizvod/' + slug]);
    }
    goToCategory(slug) {
        this.router.navigate(['/kategorija/' + slug]);
    }
    goToGroup(slug) {
        this.router.navigate(['/potkategorija/' + slug]);
    }

    /* Get brand */
    getProduct() {
        let slug;
        this.activatedRoute.params.subscribe((params: Params) => {
            slug = params['slug'];
        });
        this.productService.getBySlug(slug).subscribe(response => {
            this.product = response.object;
            this.title.setTitle(this.product.name + ' | ElectroVision Kragujevac');
        });
    }

    /* Get products + filter */
    getProducts() {
        this.productService.get().subscribe(response => {
            const categoryFilter = this.product.category.name;
            this.productList = response.object.filter(
                p => p.name !== this.product.name
            );
            if (categoryFilter) {
                this.productList = this.productList.filter(
                    p => p.category.name === categoryFilter
                );
            }
        });
    }
}

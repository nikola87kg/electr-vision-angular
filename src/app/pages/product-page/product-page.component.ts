import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ProductsService, ProductInterface } from '../../_services/products.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons/faTwitterSquare';
import { SeoService } from 'src/app/_services/seo.service';

@Component({
    selector: 'px-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

    product: ProductInterface;
    productList: Array<ProductInterface> ;
    twIcon = faTwitterSquare;
    fbIcon = faFacebookSquare;
    title: string;
    description: string;
    image: string;
    slug: string;
    url: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private productService: ProductsService,
        private router: Router,
        private seo: SeoService
    ) {
        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.getProduct();
            }
        });
    }

    ngOnInit() {
    }

    /* Navigation */
    goToBrand(slug) {
        this.router.navigate(['/pretraga/kategorije/sve'], {
            queryParams: { brand: slug } 
        });
    }
    goToProduct(slug) {
        this.router.navigate(['/proizvod/' + slug]);
    }
    goToCategory(slug) {
        this.router.navigate(['/pretraga/potkategorije/' + slug]);
    }
    goToGroup(slug) {
        this.router.navigate(['/pretraga/proizvodi/' + slug]);
    }

    /* Get brand */
    getProduct() {
        let slug;
        this.activatedRoute.params.subscribe((params: Params) => {
            slug = params['slug'];
        });
        this.productService.getBySlug(slug).subscribe(response => {
            this.product = response;
            
            this.title = this.product.name;
            this.description = this.product.description;
            this.image = this.product.image;
            this.slug = 'proizvod/' + this.product.slug;
            this.url = 'http://electrovision.rs/' + this.slug;
            console.log(this.url)
            /* SEO */
            this.seo.generateTags( {
                title: this.title,
                description: this.description,
                image:  this.image,
                slug: this.slug
            })

            this.getProducts();
        });
    }

    /* Get products + filter */
    getProducts() {
        this.productService.get().subscribe(response => {
            const groupId = this.product.group._id;
            this.productList = response.filter(
                p => p._id !== this.product._id
            );
            if (groupId) {
                this.productList = this.productList.filter(
                    p => p.group._id === groupId
                );
            }
        });
    }
}

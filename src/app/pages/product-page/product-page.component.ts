import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { SnackbarComponent } from 'src/app/partials/snackbar/snackbar.component';
import { SeoService } from 'src/app/_services/seo.service';
import { SharedService } from 'src/app/_services/shared.service';
import { ProductInterface, ProductsService } from '../../_services/products.service';
import { CartService } from './../../_services/cart.service';

@Component({
  selector: 'px-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  product: ProductInterface;
  productList: Array<ProductInterface>;
  title: string;
  description: string;
  image: string;
  slug: string;
  url: string;
  isFullPage: boolean;
  fullPageImage: string;
  faChevronRight = faChevronRight;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService,
    private router: Router,
    private seo: SeoService,
    public snackBar: MatSnackBar,
    public sharedService: SharedService
  ) {
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.getProduct();
      }
    });
  }

  zoomImage(image): void {
    this.isFullPage = !this.isFullPage;
    this.fullPageImage = image;
  }


  ngOnInit(): void {
  }

  /* Navigation */
  goToBrand(slug): void {
    this.router.navigate(['/pretraga/kategorije/sve'], {
      queryParams: { brand: slug }
    });
  }
  goToProduct(slug): void {
    this.router.navigate(['/proizvod/' + slug]);
  }
  goToCategory(slug): void {
    this.router.navigate(['/pretraga/potkategorije/' + slug]);
  }
  goToGroup(slug): void {
    this.router.navigate(['/pretraga/proizvodi/' + slug]);
  }

  /* Get brand */
  getProduct(): void {
    let slug;
    this.activatedRoute.params.subscribe((params: Params) => {
      slug = params.slug;
    });
    this.productService.getBySlug(slug).subscribe(response => {
      this.product = response;

      this.title = this.product.name;
      this.description = this.product.description;
      this.image = this.product.image;
      this.slug = 'proizvod/' + this.product.slug;
      this.url = 'http://electrovision.rs/' + this.slug;
      /* SEO */
      this.seo.generateTags({
        title: this.title,
        description: this.description,
        image: this.image,
        slug: this.slug
      });

      this.getProducts();
    });
  }

  getProducts(): void {
    this.sharedService.productList$$.subscribe(result => {
      if (result) {
        if (this.product.group != null) {
          const groupId = this.product.group._id;
          this.productList = result.filter(
            p => p._id !== this.product._id
          );
          if (groupId) {
            this.productList = this.productList.filter(
              p => p.group._id === groupId
            );
          }
        }
      } else {
        setTimeout(() => {
          this.getProducts();
        }, 1);
      }
    });
  }

  addToCart(id, count): void {
    this.cartService.addToCart(id, count);
  }

  /* Snackbar */
  openSnackBar(object): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      data: object,
    });
  }

}

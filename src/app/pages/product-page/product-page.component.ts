import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ProductsService, ProductInterface } from '../../_services/products.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons/faTwitterSquare';
import { SeoService } from 'src/app/_services/seo.service';
import { SharedService } from 'src/app/_services/shared.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from 'src/app/partials/snackbar/snackbar.component';

@Component({
  selector: 'px-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  product: ProductInterface;
  productList: Array<ProductInterface>;
  twIcon = faTwitterSquare;
  fbIcon = faFacebookSquare;
  title: string;
  description: string;
  image: string;
  slug: string;
  url: string;
  isFullPage: boolean;
  fullPageImage: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
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

  zoomImage(image) {
    this.isFullPage = !this.isFullPage;
    this.fullPageImage = image;
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
      /* SEO */
      this.seo.generateTags({
        title: this.title,
        description: this.description,
        image: this.image,
        slug: this.slug
      })

      this.getProducts();
    });
  }

  getProducts() {
    this.sharedService.productList.subscribe(result => {
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
          this.getProducts()
        }, 1)
      }
    });
  }

  addToCart(id) {
    let cartString = localStorage.getItem('cart');
    let cartArray = JSON.parse(cartString) || [];
    if (id && cartArray && !cartArray.includes(id)) {
      cartArray.push(id);
      localStorage.setItem('cart', JSON.stringify(cartArray));
      this.openSnackBar({ action: 'cart', type: 'new' });
    } else {
      this.openSnackBar({ action: 'cart', type: 'exist' });
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

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/partials/snackbar/snackbar.component';
import { BrandsService } from 'src/app/_services/brands.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { ProductsService } from '../../_services/products.service';
import { SharedService } from '../../_services/shared.service';

enum Type {
    cat = 'kategorije',
    group = 'potkategorije',
    prod = 'proizvodi'
}

@Component({
    selector: 'px-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    headline: string;
    screenSize: string;
    isLoaded: boolean;

    currentLevel: string;
    currentSlug: string;
    currentName: string;
    currentBrand: string;

    currentList: Array<any>;
    categoryList: Array<any>;
    brandList: Array<any>;

    firstItemOnPage = 0;
    itemsPerPage = 96;
    pages: Array<number> = [];
    pageArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    lastCategory: any;
    lastGroup: any;
    gridView = false;

    backButtontext = 'Nazad';

    constructor(
        public productService: ProductsService,
        public groupService: GroupsService,
        public categoryService: CategoriesService,
        public snackBar: MatSnackBar,
        public brandService: BrandsService,
        public sharedService: SharedService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public title: Title
    ) {
        this.gridView = localStorage.getItem('itemView') === 'grid' ? true : false;
        localStorage.setItem('itemView', this.gridView ? 'grid' : 'list');
        title.setTitle('Proizvodi | ElectroVision Kragujevac');
        this.activatedRoute.params.subscribe(params => {
            this.currentSlug = params.slug;
            this.currentLevel = params.level;
        });
        this.activatedRoute.queryParams.subscribe(query => {
            this.currentBrand = query.brand;
        });
        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.checkLevel();
            }
        });
    }

    ngOnInit(): void {
        this.checkLevel();
        this.getBrands();
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
    }

    /* Set current level, name & slug */
    checkLevel(): void {
        if (this.currentLevel === Type.cat) {
            this.getCategories(this.currentBrand);
        } else if (this.currentLevel === Type.group) {
            this.getGroups();
        } else {
            this.getProducts(null, this.currentBrand);
            this.itemsPerPage = 6;
        }
        switch (this.currentLevel) {
            case Type.cat: this.headline = 'Pretraga kategorija';
                break;
            case Type.group: this.headline = 'Pretraga potkategorija';
                break;
            case Type.prod: this.headline = 'Pretraga proizvoda';
                break;
        }
        this.getName(this.currentLevel, this.currentSlug);

    }

    /* Category button */
    goBackToCategoryLevel(): void {
        this.itemsPerPage = 96;
        this.currentLevel = Type.cat;
        this.currentSlug = 'sve';
        this.router.navigate(
            ['/pretraga', this.currentLevel, this.currentSlug],
            {
                relativeTo: this.activatedRoute,
                queryParams: { brand: this.currentBrand }
            }
        );
        this.getCategories(this.currentBrand);
        this.setPage(0);
    }

    /* Group button */
    goBackToGroupLevel(): void {
        this.itemsPerPage = 96;
        const slug = this.lastCategory.slug;
        this.router.navigate(
            ['/pretraga', Type.group, slug],
            {
                relativeTo: this.activatedRoute,
                queryParams: { brand: this.currentBrand }
            }
        );
        this.getGroups(this.lastCategory._id);
        this.setPage(0);
    }

    /* Back button */
    goStepBack(): void {
        if (this.currentLevel === Type.group) {
            this.currentLevel = Type.cat;
            this.currentSlug = 'sve';
            this.router.navigate(
                ['/pretraga', this.currentLevel, this.currentSlug],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: { brand: this.currentBrand }
                }
            );
            this.getCategories(this.currentBrand);
        } else if (this.currentLevel === Type.prod) {
            this.currentLevel = Type.group;
            this.currentSlug = this.lastGroup.slug;
            this.router.navigate(
                ['/pretraga', this.currentLevel, this.currentSlug],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: { brand: this.currentBrand }
                }
            );
            this.getGroups(this.lastCategory._id);
        }
    }

    /* On Item Click */
    goForward(item): void {
        const level = this.currentLevel;
        if (level === Type.cat) {
            this.router.navigate(
                ['/pretraga', Type.group, item.slug],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: { brand: this.currentBrand }
                }
            );
            this.lastCategory = item;
            this.getGroups(item._id);
            return;
        } else if (level === Type.group) {
            this.itemsPerPage = 6;
            this.router.navigate(
                ['/pretraga', Type.prod, item.slug],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: { brand: this.currentBrand }
                }
            );
            this.getProducts(item._id);
            this.lastGroup = item;
            return;
        } else {

            this.goToProduct(item.slug);
            return;
        }
    }

    /* Get brands*/
    getBrands(): void {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
        });

    }

    /* Get categories*/
    getCategories(brandSlug?): void {
        this.currentName = null;
        this.sharedService.categoryList.subscribe(response => {
            this.categoryList = response;
            if (brandSlug || this.currentBrand) {
                const brand = brandSlug || this.currentBrand;
                this.sharedService.productList.subscribe(res2 => {
                    const filteredProducts = res2 && res2.filter(product => product.brand.slug === brand);
                    const catSlugs = filteredProducts.map(product => product.category.slug);
                    this.currentList = response.filter(cat => catSlugs.includes(cat.slug));

                });
            } else {
                this.currentList = response;
            }
        });
    }

    /* Get groups by Category */
    getGroups(categoryId?, brandSlug?): void {
        let id;
        if (categoryId) {
            id = categoryId;
            this.groupService.get().subscribe(response => {
                if (brandSlug || this.currentBrand) {
                    const brand = brandSlug || this.currentBrand;
                    this.sharedService.productList.subscribe(res2 => {
                        const filteredProducts = res2.filter(product => product.brand.slug === brand);
                        const groupSlugs = filteredProducts.map(product => product.group.slug);
                        this.currentList = response
                            .filter(group => groupSlugs.includes(group.slug))
                            .filter(group => group.category._id === categoryId);
                    });
                } else {
                    this.currentList = response.filter(
                        group => group.category._id === categoryId
                    );
                }
            });
        } else {
            this.categoryService.getBySlug(this.currentSlug).subscribe(res1 => {
                id = res1._id;
                this.groupService.get().subscribe(res2 => {
                    if (brandSlug) {
                        this.sharedService.productList.subscribe(res3 => {
                            const filteredProducts = res3.filter(product => product.brand.slug === brandSlug);
                            const groupSlugs = filteredProducts.map(product => product.group.slug);
                            this.currentList = res2.filter(group => groupSlugs.includes(group.slug));
                            this.currentList = res2.filter(group => group.category._id === categoryId);
                        });
                    } else {
                        this.currentList = res2.filter(
                            group => group.category._id === id
                        );
                    }
                });
            });
        }
    }

    /* Get products by Group */

    getProducts(groupId?, brandSlug?): void {
        let id;
        if (groupId) {
            this.sharedService.productList.subscribe(response => {
                this.currentList = response.filter(
                    product => product.group._id === groupId
                );
                const pageLength = Math.ceil(this.currentList.length / this.itemsPerPage);
                this.pages = this.pageArray.slice(0, pageLength);
            });
        } else {
            this.groupService.getBySlug(this.currentSlug).subscribe(res1 => {
                this.lastGroup = res1;
                this.lastCategory = res1.category;
                id = res1._id;
                this.sharedService.productList.subscribe(res2 => {
                    this.currentList = res2 && res2.filter(
                        (product) => product.group._id === id
                    );
                    const pageLength = Math.ceil(this.currentList.length / this.itemsPerPage);
                    this.pages = this.pageArray.slice(0, pageLength);
                    if (brandSlug) {
                        const brand = brandSlug || this.currentBrand;
                        this.currentList = this.currentList.filter(
                            (product) => product.brand.slug === brand
                        );
                        const pageLength2 = Math.ceil(this.currentList.length / this.itemsPerPage);
                        this.pages = this.pageArray.slice(0, pageLength2);
                    }
                });
            });
        }
    }

    /* Navigation */
    goToProduct(slug): void {
        this.router.navigate(['/proizvod/' + slug]);
    }

    /* Get Current Item Name */
    getName(level, slug): void {
        this.currentName = null;
        if (level === Type.cat) {
            this.currentName = null;
        } else if (level === Type.group) {
            this.categoryService.getBySlug(slug).subscribe(category => {
                this.currentName = category.name;
            });
        } else if (level === Type.prod) {
            this.groupService.getBySlug(slug).subscribe(group => {
                this.currentName = group.name;
            });
        }
    }

    /* Filter by brand */
    filterByBrand(brandSlug?): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { brand: brandSlug }
        });
        if (this.currentLevel === Type.cat) {
            this.getCategories(brandSlug);
        } else if (this.currentLevel === Type.group) {
            this.getGroups(null, brandSlug);
        } else if (this.currentLevel === Type.prod) {
            this.getProducts(null, brandSlug);
        }
    }

    setPage(index): void {
        this.firstItemOnPage = index * this.itemsPerPage;
    }

    subscribeToPageChanges(): void {
        const pageLength = Math.ceil(this.currentList.length / this.itemsPerPage);
        this.pages = this.pageArray.slice(0, pageLength);
    }


    addToCart(event, id): void {
        event.stopPropagation();
        const cartString = localStorage.getItem('cart');
        const cartArray = JSON.parse(cartString) || [];
        if (id && cartArray && !cartArray.includes(id)) {
            cartArray.push(id);
            localStorage.setItem('cart', JSON.stringify(cartArray));
            this.openSnackBar({ action: 'cart', type: 'new' });
        } else {
            this.openSnackBar({ action: 'cart', type: 'exist' });
        }
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 3000,
            data: object,
        });
    }

    setGridView(isGrid: boolean): void {
        this.gridView = isGrid;
        localStorage.setItem('itemView', isGrid ? 'grid' : 'list');
    }

}

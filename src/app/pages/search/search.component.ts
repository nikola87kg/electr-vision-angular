import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../_services/products.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SharedService } from '../../_services/shared.service';
import { Title } from '@angular/platform-browser';
import { BrandsService } from 'src/app/_services/brands.service';

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

    lastCategory: any;
    lastGroup: any;
    
    backButtontext: string = 'Nazad';

    constructor(
        public productService: ProductsService,
        public groupService: GroupsService,
        public categoryService: CategoriesService,
        public brandService: BrandsService,
        public sharedService: SharedService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public title: Title
    ) {
        title.setTitle('Proizvodi | ElectroVision Kragujevac');
        this.activatedRoute.params.subscribe(params => {
            this.currentSlug = params['slug'];
            this.currentLevel = params['level'];
        });   
        this.activatedRoute.queryParams.subscribe(query => {
            this.currentBrand = query['brand'];
        })
        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.checkLevel();
            }
        });     
    }

    ngOnInit() {
        this.checkLevel();
        this.getBrands();
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
    }

    /* Set current level, name & slug */
    checkLevel() {
        if(this.currentLevel === Type.cat) {
            this.getCategories(this.currentBrand);
        } else if(this.currentLevel === Type.group) {
            this.getGroups();
        } else {
            this.getProducts(null, this.currentBrand);
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
    goBackToCategoryLevel() {
        this.currentLevel = Type.cat
        this.currentSlug = 'sve'
        this.router.navigate(
            ['/pretraga', this.currentLevel, this.currentSlug], 
            { 
                relativeTo: this.activatedRoute, 
                queryParams: {brand: this.currentBrand} 
            }
        );
        this.getCategories(this.currentBrand);
    }

    /* Group button */
    goBackToGroupLevel() {
        const slug = this.lastCategory.slug;
        this.router.navigate(
            ['/pretraga', Type.group, slug], 
            { 
                relativeTo: this.activatedRoute, 
                queryParams: {brand: this.currentBrand} 
            }
        );
        this.getGroups(this.lastCategory._id);
    };

    /* Back button */
    goStepBack() {
        if (this.currentLevel === Type.group) {
            this.currentLevel = Type.cat
            this.currentSlug = 'sve'
            this.router.navigate(
                ['/pretraga', this.currentLevel, this.currentSlug], 
                { 
                    relativeTo: this.activatedRoute, 
                    queryParams: {brand: this.currentBrand} 
                }
            );
            this.getCategories(this.currentBrand);
        } else if(this.currentLevel === Type.prod) {
            this.currentLevel = Type.group
            this.currentSlug = this.lastGroup.slug;
            this.router.navigate(
                ['/pretraga', this.currentLevel, this.currentSlug], 
                { 
                    relativeTo: this.activatedRoute, 
                    queryParams: {brand: this.currentBrand} 
                }
            );
            this.getGroups(this.lastCategory._id);
        }
    }

    /* On Item Click */
    goForward(item) {
        let level = this.currentLevel;
        if (level === Type.cat) { 
            this.router.navigate (
                ['/pretraga', Type.group, item.slug], 
                { 
                    relativeTo: this.activatedRoute, 
                    queryParams: {brand: this.currentBrand} 
                }
            );
            this.lastCategory = item;
            this.getGroups(item._id);
            return
        } else if (level === Type.group) {
            this.router.navigate(
                ['/pretraga', Type.prod, item.slug], 
                { 
                    relativeTo: this.activatedRoute, 
                    queryParams: {brand: this.currentBrand} 
                }
            );
            this.getProducts(item._id);
            this.lastGroup = item;
            return
        } else {
            this.goToProduct(item.slug);
            return
        }
    }

    /* Get brands*/
    getBrands() {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
        });
        
    }

    /* Get categories*/
    getCategories(brandSlug?) {
        this.currentName = null;
        this.categoryService.get().subscribe(response => {
            this.categoryList = response;
            if(brandSlug || this.currentBrand) {
                let brand = brandSlug || this.currentBrand
                this.productService.get().subscribe(res2 => {
                    let filteredProducts = res2.filter( product => product.brand.slug === brand);
                    let catSlugs = filteredProducts.map( product => product.category.slug);
                    this.currentList = response.filter( cat => catSlugs.includes(cat.slug) );
                    
                })
            } else {
                this.currentList = response;
            }
        });
    }

    /* Get groups by Category */
    getGroups(categoryId?, brandSlug?) {
        let id;
        if(categoryId) {
            id = categoryId;
            this.groupService.get().subscribe(response => {
                if(brandSlug || this.currentBrand) {
                    let brand = brandSlug || this.currentBrand
                    console.log(1, this.currentList)
                    this.productService.get().subscribe(res2 => {
                        console.log(20, res2)
                        let filteredProducts = res2.filter( product => product.brand.slug === brand);
                        console.log(21, filteredProducts)
                        let groupSlugs = filteredProducts.map( product => product.group.slug);
                        console.log(22, this.currentList)
                        console.log(221, groupSlugs)
                        this.currentList = response
                            .filter(group => groupSlugs.includes(group.slug) )
                            .filter(group => group.category._id === categoryId );
                        console.log(23, this.currentList)
                    })
                    console.log(2, this.currentList)
                } else {
                    console.log(3, this.currentList)
                    this.currentList = response.filter(
                        group => group.category._id === categoryId
                    );
                    console.log(4, this.currentList)
                }
            });
        } else {
            this.categoryService.getBySlug(this.currentSlug).subscribe(res1 => {
                id = res1._id
                this.groupService.get().subscribe(res2 => {
                    if(brandSlug) {
                        this.productService.get().subscribe(res3 => {
                            let filteredProducts = res3.filter( product => product.brand.slug === brandSlug);
                            let groupSlugs = filteredProducts.map( product => product.group.slug);
                            this.currentList = res2.filter(group => groupSlugs.includes(group.slug) );
                            this.currentList = res2.filter(group => group.category._id === categoryId );
                        })
                    } else {
                        this.currentList = res2.filter(
                            group => group.category._id === id
                        );
                    }
                });
            })
        }
    }

    /* Get products by Group */

    getProducts(groupId?, brandSlug?) {
        let id;
        if(groupId) {
            this.productService.get().subscribe(response => {
                this.currentList = response.filter(
                    product => product.group._id === groupId
                );
            });
        } else {
            this.groupService.getBySlug(this.currentSlug).subscribe(res1 => {
                this.lastGroup = res1;
                this.lastCategory = res1.category;
                id = res1._id
                this.productService.get().subscribe(res2 => {
                    this.currentList = res2.filter(
                        (product) => product.group._id === id 
                    );
                    if(brandSlug) {
                        let brand = brandSlug || this.currentBrand;
                        this.currentList = this.currentList.filter(
                            (product) => product.brand.slug === brand 
                        );
                    }
                });
            })
        }
    }

    /* Navigation */
    goToProduct(slug) {
        this.router.navigate(['/proizvod/' + slug]);
    }

    /* Get Current Item Name */
    getName(level, slug) {
        this.currentName = null;
        if (level === Type.cat) {
            this.currentName = null;
        } else if(level === Type.group) {
            this.categoryService.getBySlug(slug).subscribe( category => {
                this.currentName = category.name
            })
        } else if(level === Type.prod) {
            this.groupService.getBySlug(slug).subscribe( group => {
                this.currentName = group.name
            })
        }
    }

    /* Filter by brand */
    filterByBrand(brandSlug?) {
        this.router.navigate([], { 
            relativeTo: this.activatedRoute, 
            queryParams: {brand: brandSlug} 
        });
        if(this.currentLevel === Type.cat) {
            this.getCategories(brandSlug);
        } else if(this.currentLevel === Type.group) {
            this.getGroups(null, brandSlug);
        } else if(this.currentLevel === Type.prod) {
            this.getProducts(null, brandSlug);
        }
    }

}

import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../_services/products.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SharedService } from '../../_services/shared.service';
import { Title } from '@angular/platform-browser';
import { ignoreElements } from 'rxjs/operators';

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

    currentList: Array<any>;
    categoryList: Array<any>;

    lastCategory: any;
    lastGroup: any;
    
    backButtontext: string = 'Nazad';

    constructor(
        public productService: ProductsService,
        public groupService: GroupsService,
        public categoryService: CategoriesService,
        public sharedService: SharedService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public title: Title
    ) {
        title.setTitle('Proizvodi | ElectroVision Kragujevac');
        this.activatedRoute.params.subscribe(params => {
            this.currentSlug = params['slug'];
            this.currentLevel = params['level'];
            console.log('params', params)
            switch (this.currentLevel) {
                case 'kategorije': this.headline = "Pretraga kategorija";
                break;
                case 'potkategorije': this.headline = "Pretraga potkategorija";
                break;
                case 'proizvodi': this.headline = "Pretraga proizvoda";
                break;
            }
        });   
        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                console.log('url', e.url);
            }
        });     
    }

    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.checkLevel();
    }

    onLoadCompleted() {
        this.isLoaded = true;
    }

    checkLevel() {
        if(this.currentLevel === 'kategorije') {
            this.getCategories();
        } else if(this.currentLevel === 'potkategorije') {
            this.getGroups();
        } else {
            this.getProducts();
        }

    }

    goBackToCategoryLevel() {
        this.router.navigate(['/pretraga', 'kategorije', 'sve']);
        this.getCategories();
    }

    goBackToGroupLevel() {
        this.activatedRoute.params.subscribe( params => {
            const slug = params['slug'];
            this.router.navigate(['/pretraga', 'potkategorije', slug])
            })  
    };

    goStepBack() {
        if (this.currentLevel === 'potkategorije') {
            this.currentLevel = 'kategorije'
            this.currentSlug = 'sve'
            console.log(6, this.currentLevel, this.currentSlug)
            this.router.navigate(['/pretraga', this.currentLevel, this.currentSlug]);
            this.getCategories();
        } else if(this.currentLevel === 'proizvodi') {
            this.currentLevel = 'potkategorije'
            this.currentSlug = this.lastGroup.slug;
            console.log(5, this.currentLevel, this.currentSlug)
            this.router.navigate(['/pretraga', this.currentLevel, this.currentSlug]);
            this.getGroups(this.lastCategory._id);
        }
    }

    goForward(item) {
        let level = this.currentLevel;
        console.log('level', level);
        if (level === 'kategorije') { 
            this.router.navigate(['/pretraga', "potkategorije", item.slug]);
            this.lastCategory = item;
            this.getGroups(item._id);
            return
        } else if (level === 'potkategorije') {
            this.router.navigate(['/pretraga', "proizvodi", item.slug]);
            this.getProducts(item._id);
            this.lastGroup = item;
            return
        } else {
            this.goToProduct(item.slug);
            return
        }
    }

    /* Get categories*/
    getCategories() {
        this.categoryService.get().subscribe(response => {
            this.currentList = response;
            this.categoryList = response;
            this.onLoadCompleted();
        });
    }

    /* Get groups by Category */
    getGroups(categoryId?) {
        let id;
        if(categoryId) {
            id = categoryId;
            this.groupService.get().subscribe(response => {
                this.currentList = response.filter(
                    group => group.category._id === categoryId
                );
            });
        } else {
            this.categoryService.getBySlug(this.currentSlug).subscribe(res1 => {
                id = res1._id
                this.groupService.get().subscribe(res2 => {
                    this.currentList = res2.filter(
                        group => group.category._id === id
                    );
                });
            })
            
        }
    }

    /* Get products by Group */
    getProducts(groupId?) {
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
                        product => product.group._id === id
                    );
                });
            })
            
        }
    }

    /* Navigation */
    goToProduct(slug) {
        this.router.navigate(['/proizvod/' + slug]);
    }
}

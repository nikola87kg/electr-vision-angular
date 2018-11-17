import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../_services/products.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { Router } from '@angular/router';
import { SharedService } from '../../_services/shared.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-products-all',
    templateUrl: './products-all.component.html',
    styleUrls: ['./products-all.component.scss']
})
export class ProductsAllComponent implements OnInit {
    headline: string;
    isLoaded: boolean;
    currentLevel: number;
    currentList: Array<any>;
    categoryList: Array<any>;
    lastCategory: any;
    lastGroup: any;
    screenSize: string;
    selectedItemName: string = 'Sve kategorije';
    selectedCategory = {};
    backButtontext: string = 'Nazad';

    constructor(
        public productService: ProductsService,
        public groupService: GroupsService,
        public categorytService: CategoriesService,
        public sharedService: SharedService,
        private router: Router,
        public title: Title
    ) {
        title.setTitle('Proizvodi | ElectroVision Kragujevac');
    }

    ngOnInit() {
        this.currentLevel = 1;
        this.headline = 'Kategorije proizvoda';
        this.getCategories();
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
    }

    onLoadCompleted() {
        this.isLoaded = true;
    }

    OnLevelChange(increment, item?) {
        if (increment === 100) {
            this.currentLevel = 1;
        } else {
            this.currentLevel = this.currentLevel + increment;
        }
        if ( this.currentLevel === 1 ) {
            /* CategoryList */
            this.getCategories();
            this.selectedItemName = 'Sve kategorije';
        } else if ( this.currentLevel === 2 ) {
            /* GroupList */
            let tempID = this.lastCategory ? this.lastCategory._id : null;
            this.selectedItemName = 'Filtrirane grupe proizvoda';
            if (item) {
                tempID = item._id;
                this.lastCategory = item;
                this.selectedCategory = item;
            } else {
                this.selectedCategory = this.lastCategory;
            }
            this.getGroups(tempID);
        } else if ( this.currentLevel === 3 ) {
            /* ProductList */
            let tempID = this.lastCategory._id;
            if (item) {
                tempID = item._id;
                this.lastGroup = item;
            }
            this.getProducts(tempID);
            this.selectedItemName = 'Filtrirani proizvodi';
        } else if ( this.currentLevel === 4 ) {
            this.goToProduct(item.slug);
        }
    }

    /* Get categories*/
    getCategories() {
        this.categorytService.get().subscribe(response => {
            this.currentList = response;
            this.categoryList = response;
            this.onLoadCompleted();
        });
    }

    /* Get groups by Category */
    getGroups(categoryId) {
        this.groupService.get().subscribe(response => {
            this.currentList = response.filter(
                group => group.category._id === categoryId
            );

        });
    }

    /* Get products by Group */
    getProducts(groupId) {
        this.productService.get().subscribe(response => {
            this.currentList = response.filter(
                product => product.group._id === groupId
            );
        });
    }

    /* Navigation */
    goToProduct(slug) {
        this.router.navigate(['/proizvod/' + slug]);
    }
}

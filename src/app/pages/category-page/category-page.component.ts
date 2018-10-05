import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { ProductsService } from '../../_services/products.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'px-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {
    category = {
        _id: '',
        name: '',
        description: '',
        image: ''
    };

    categoryList = [];
    groupList = [];
    productList = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private categoryService: CategoriesService,
        private groupService: GroupsService,
        private router: Router,
        private productService: ProductsService,
        private title: Title
    ) {
        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.getCategory();
                this.getProducts();
                this.getGroups();
                this.getCategories()
            }
        });
    }

    ngOnInit() {
        this.getCategory();
        this.getCategories();
        this.getProducts();
        this.getGroups();
        this.title.setTitle('test | Electrovision Kragujevac');
    }

    /* Get category */
    getCategory() {
        let slug;
        this.activatedRoute.params.subscribe((params: Params) => {
            slug = params['slug'];
        });
        this.categoryService.getBySlug(slug).subscribe(response => {
            this.category = response.object;
            this.title.setTitle(this.category.name + ' | ElectroVision Kragujevac');
        });
    }

    /* Get products + filter */
    getProducts() {
        this.productService.get().subscribe(response => {
            this.productList = response.object.filter(
                product => product.category.name === this.category.name
            );
        });
    }

    /* Get categories */
    getCategories() {
        this.categoryService.get().subscribe(response => {
            let catList = response.object.filter(cat => cat._id !== this.category._id);
            this.categoryList = catList;
        });
    }

    /* Get groups */
    getGroups() {
        this.groupService.get().subscribe(response => {
            this.groupList = response.object.filter(
                group => group.category.name === this.category.name
            );
        });
    }

    /* Navigation */
    goToCategory(slug) {
        this.router.navigate(['/kategorija/' + slug]);
    }

    goToProduct(slug) {
        this.router.navigate(['/proizvod/' + slug]);
    }
    goToGroup(slug) {
        this.router.navigate(['/potkategorija/' + slug]);
    }
    goToProducts() {
        this.router.navigate(['/lista-proizvoda/']);
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/* Services */
import { BrandsService } from '../../_services/brands.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { ProductsService } from '../../_services/products.service';



@Component({
    selector: 'px-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    productCount: number;
    brandCount: number;
    groupCount: number;
    categoryCount: number;

    productList = [];
    brandList = [];
    groupList = [];
    categoryList = [];

    displayedColumns: string[] = ['name' ];

    constructor(
        private brandService: BrandsService,
        private categoryService: CategoriesService,
        private productService: ProductsService,
        private groupService: GroupsService,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.getBrands();
        this.getCategories();
        this.getProducts();
        this.getGroups();
    }

    /* Get products + filter */
    getProducts(): void {
        this.productService.get().subscribe(response => {
            this.productCount = response.length;
            this.productList = response.slice(0, 5);
        });
    }

    /* Get brand */
    getBrands(): void {
        this.brandService.get().subscribe(response => {
            this.brandCount = response.length;
            this.brandList = response.slice(0, 5);
        });
    }

    /* Get categories */
    getCategories(): void {
        this.categoryService.get().subscribe(response => {
            this.categoryCount = response.length;
            this.categoryList = response.slice(0, 5);
        });
    }

    /* Get groups */
    getGroups(): void {
        this.groupService.get().subscribe(response => {
            this.groupCount = response.length;
            this.groupList = response.slice(0, 5);
        });
    }

    onLogout(): void {
        localStorage.removeItem('auth_token');
        this.router.navigate(['/pocetna']);
    }

}

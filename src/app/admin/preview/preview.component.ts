import { Component, OnInit } from '@angular/core';

/* Services */
import { BrandsService } from '../../_services/brands.service';
import { CategoriesService } from '../../_services/categories.service';
import { ProductsService } from '../../_services/products.service';
import { GroupsService } from '../../_services/groups.service';
import { AuthService } from '../../_services/auth.service';

/* Interfaces */
import { UserModel } from '../admin.interfaces';

@Component({
    selector: 'px-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
    productList = [];
    brandList = [];
    groupList = [];
    categoryList = [];
    errorMessage: string;
    displayedColumns: string[] = ['name' ];
    isLogged = false;
    isAuthDialogOpen = false;
    confirmPassword: string;
    user = {
        username: '',
        email: '',
        password: ''
    };
    dialogTitle = 'Registracija'

    constructor(
        private brandService: BrandsService,
        private categoryService: CategoriesService,
        private productService: ProductsService,
        private groupService: GroupsService,
        private authService: AuthService
        
    ) {}

    ngOnInit() {
        this.checkAuth();
        this.getBrands();
        this.getCategories();
        this.getProducts();
        this.getGroups();
    }

    /* Get products + filter */
    getProducts(categoryFilter?, groupFilter?, brandFilter?) {
        this.productService.get().subscribe(response => {
            this.productList = response;
        });
    }

    /* Get brand */
    getBrands() {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
        });
    }

    /* Get categories */
    getCategories() {
        this.categoryService.get().subscribe(response => {
            this.categoryList = response;
        });
    }

    /* Get groups */
    getGroups() {
        this.groupService.get().subscribe(response => {
            this.groupList = response;
        });
    }

    /* Auth dialog */
    toggleAuthDialog( type? ){
        console.log(type);
        this.isAuthDialogOpen = !this.isAuthDialogOpen;
        if(!this.isAuthDialogOpen) {
            this.confirmPassword = '';
            this.user = {
                username: '',
                email: '',
                password: ''
            }
        }
    }

    onRegister() {
        if( this.user.password === this.confirmPassword ) {
            this.errorMessage = ''
            const payload = {
                username: this.user.username,
                password: this.user.password,
                email: this.user.email,
            }
            this.authService.registerUser(payload).subscribe( res => {
                if (res.object.admin) {
                    localStorage.setItem('user', res.object.username)
                }
                this.checkAuth();
                this.toggleAuthDialog();
            })
        } else {
            this.errorMessage = 'Lozinke se ne poklapaju'
        }
    }

    checkAuth() {
        const user = localStorage.getItem('user');
        if (user) {
            this.isLogged = true;
        } else {
            this.isLogged = false;
        }
    }

    onLogout() {
        localStorage.removeItem('user');
        this.checkAuth();
    }

}

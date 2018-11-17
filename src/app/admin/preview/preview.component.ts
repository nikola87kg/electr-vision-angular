import { Component, OnInit } from '@angular/core';

/* Services */
import { BrandsService } from '../../_services/brands.service';
import { CategoriesService } from '../../_services/categories.service';
import { ProductsService } from '../../_services/products.service';
import { GroupsService } from '../../_services/groups.service';
import { AuthService, UserInterface } from '../../_services/auth.service';


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
    authType: string;
    confirmPassword: string;
    user: UserInterface = {email:'', username: '', password: '', token: '', admin: true};
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
        console.log(this.user)
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
        
        this.authType = type;
        console.log(123, this.authType)

        this.isAuthDialogOpen = !this.isAuthDialogOpen;
        if(!this.isAuthDialogOpen) {
            this.confirmPassword = '';
            this.user = {
                username: '',
                email: '',
                token: '',
                password: '',
                admin: true
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
                this.checkAuth();
                this.toggleAuthDialog();
            })
        } else {
            this.errorMessage = 'Lozinke se ne poklapaju'
        }
    }

    onLogin() {
        const payload = {
            email: this.user.email,
            password: this.user.password,
        }
        this.authService.loginUser(payload).subscribe( (response)=> {
            localStorage.setItem('auth_token', response.token); 
            this.toggleAuthDialog();
            this.checkAuth();
        } )
    }

    checkAuth() {
        const ls = localStorage.getItem('auth_token');
        if (ls) {
            this.isLogged = true;
        } else {
            this.isLogged = false;
        }
    }

    onLogout() {
        localStorage.removeItem('auth_token');
        this.checkAuth();
        this.isLogged = false;
    }

}

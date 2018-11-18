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
    dialogTitle: string;
    mismatchError: string;
    serverError = {username:'', email: '', login: ''}
    user= {username:'', email: '', password: '', confirm: ''};

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
        this.dialogTitle = type === 'login' ? 'Logovanje' : 'Registracija';
        this.authType = type;
        this.isAuthDialogOpen = !this.isAuthDialogOpen;
    }

    onRegister(form) {
        this.mismatchError = "";
        this.serverError.email = "";
        this.serverError.username = "";
        this.serverError.login = "";
        if(form) {
            if(form.password !== form.confirm) {
                this.mismatchError = "* Lozinke se moraju poklapati";
            } else {
                const payload = {
                    username: form.username,
                    password: form.password,
                    email: form.email,
                }
                this.authService.registerUser(payload).subscribe( res => {
                    this.checkAuth();
                    this.toggleAuthDialog();
                }, err => {
                    if(err.error.errors.email) {
                        this.serverError.email = err.error.errors.email.kind === "unique" && 
                            "* Ovaj email već postoji u bazi ";
                    }
                    if(err.error.errors.username) {
                        this.serverError.username = err.error.errors.username.kind === "unique" && 
                            "* Ovo korisničko ime već postoji u bazi ";
                    }
                })
            }
        }
    }

    onLogin(form) {
        this.serverError.email = "";
        this.serverError.username = "";
        this.serverError.login = "";
        if(form) {
            const payload = {
                email: form.email,
                password: form.password,
            }
            this.authService.loginUser(payload).subscribe( response=> {
                localStorage.setItem('auth_token', response.token); 
                this.toggleAuthDialog();
                this.checkAuth();
            }, err => {
                if(err.error) {
                    console.log(123, err.error)
                    switch(err.error.error) {
                        case "password error": this.serverError.login = "* Pogrešna lozinka";
                        break;
                        case "username error": this.serverError.login = "* Ne postoji nalog sa navedenim emailom";
                        break;
                        case "admin error": this.serverError.login = "* Korisnik nema ovlašćenja administratora";
                        break;
                    }
                }
            } )
        }
    }

    checkAuth() {
        const auth_token = localStorage.getItem('auth_token');
        if (auth_token) {
            this.isLogged = true;
        } else {
            this.isLogged = false;
        }
    }

    onLogout() {
        localStorage.removeItem('auth_token');
        this.checkAuth();
    }

}

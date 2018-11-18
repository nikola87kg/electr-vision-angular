import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ProductsService } from '../../_services/products.service';
import { SharedService } from '../../_services/shared.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';

declare var $: any;

@Component({
    selector: 'px-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(
        private productService: ProductsService,
        private router: Router,
        public sharedService: SharedService,
        private authService: AuthService
    ) {}

    showResult = false;

    searchInput = new FormControl();
    options = [];
    products = [];
    filteredOptions: Observable<any[]>;
    screenSize = null;
    dialogTitle: string;
    serverError = {username:'', email: '', login: ''}
    mismatchError: string;
    errorMessage: string;
    isLogged: boolean;
    authType: string;
    isAuthDialogOpen = false;
    user= {username:'', email: '', password: '', confirm: ''};


    @HostListener('window:resize', ['$event']) onResize(event) {
        const innerWidth = event.target.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        this.sharedService.screenSize.next(this.screenSize);
    }

    ngOnInit() {
        this.checkWidth();
        this.sharedService.screenSize.next(this.screenSize);
        this.getAllProducts();
        setTimeout(() => {
            this.filteredOptions = this.searchInput.valueChanges.pipe(
                startWith(''),
                map( value => this._filter(value) )
            );
        }, 500);
    }

    private _filter(value: string): string[] {
        const lcValue = value.toLowerCase();
        return this.options.filter(
            option => option.name.toLowerCase().indexOf(lcValue) === 0
        );
    }

    getAllProducts() {
        this.productService.get().subscribe( (result) => {
            this.options = result
        });
    }

    goToProduct(slug) {
        this.showResult = false;
        this.router.navigate(['/proizvod/' + slug]);
    }

    goToProductByName(name) {
        const product = this.options.filter( option => option.name === name)[0];
        this.router.navigate(['/proizvod/' + product.slug]);
    }

    checkWidth() {
        const innerWidth = window.innerWidth;
        if (innerWidth > 1028) {
            this.screenSize = 'large';
        } else if (innerWidth > 768) {
            this.screenSize = 'medium';
        } else {
            this.screenSize = 'small';
        }
        this.sharedService.screenSize.next(this.screenSize);
    }

    /* Reg & Login */
    
    /* Auth dialog */
    toggleAuthDialog( auth?, state? ){
        this.dialogTitle = auth === 'login' ? 'Logovanje' : 'Registracija';
        this.authType = auth;
        this.isAuthDialogOpen = state;
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
                this.router.navigate(['/admin'])
            }, err => {
                if(err.error) {
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

}

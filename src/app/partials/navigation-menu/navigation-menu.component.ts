import { Component, OnInit, HostListener } from '@angular/core';
import { SharedService } from '../../_services/shared.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'px-navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {
    navItemsVisible = false;
    actualWidth = Math.min(window.innerWidth, screen.width);
    dialogTitle: string;
    serverError = {username:'', email: '', login: ''}
    mismatchError: string;
    errorMessage: string;
    isLogged: boolean;
    submitted: boolean;
    authType: string;
    isMenuIconVisible: boolean;
    isAuthDialogOpen = false;
    user = {username:'', email: '', password: '', confirm: ''};

    navItems = [
        { id: 1, name: 'Početna', link: '/pocetna', icon: 'home' },
        { id: 2, name: 'Proizvodi', link: '/pretraga/kategorije/sve', icon: 'layers' },
        { id: 3, name: 'Cenovnik', link: '/cenovnik', icon: 'assignment' },
        { id: 4, name: 'Galerija', link: '/galerija', icon: 'photo_library' },
        { id: 5, name: 'O nama', link: '/o-nama', icon: 'assignment_ind' },
        { id: 6, name: 'Kontakt', link: '/kontakt', icon: 'phone' },
        { id: 7, name: 'Servis', link: '/servis', icon: 'build' },
        { id: 8, name: 'Korpa', link: '/korpa', icon: 'shopping_cart' },
    ];

    @HostListener('window:resize', ['$event']) onResize(event) {
        this.actualWidth = event.target.innerWidth;
        this.isMenuIconVisible = this.actualWidth < this.navItems.length * 120 + 20 + 110;
    }

    constructor(
        public sharedService: SharedService,
        public authService: AuthService,
        private router: Router
    ) {}


    ngOnInit() {
        this.checkAuth();
        this.isMenuIconVisible = this.actualWidth < this.navItems.length * 120 + 20 + 110;
        this.user.email = environment.loginData.email;
        this.user.password = environment.loginData.password;
    }

    /* Toggle Lists */
    toggleList() {
        this.navItemsVisible = !this.navItemsVisible;
    }


    openNewTab(link) {
        window.open(link);
    }
    
    /* Reg & Login */
    
    toggleAuthDialog( auth?, state? ){
        this.submitted = false;
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
                    this.toggleAuthDialog();
                    this.checkAuth();
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
        this.submitted = true;
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

    logoutUser() {
        localStorage.removeItem('auth_token');
        this.isLogged = false;
        this.checkAuth();
    }

}

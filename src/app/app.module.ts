/* Core modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

/* App modules */
import { AppMaterialModule } from './app.material.module';
import { AppRoutingModule } from './app-routing.module';

/* App components */
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { BrandRollerComponent } from './partials/brand-roller/brand-roller.component';
import { SidemenuComponent } from './partials/sidemenu/sidemenu.component';
import { NavigationMenuComponent } from './partials/navigation-menu/navigation-menu.component';
import { SearchComponent } from './pages/search/search.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { PricelistComponent } from './pages/pricelist/pricelist.component';

/* Guards */
import { AdminGuard } from './admin/admin.guard';

/* Interceptors */
import { AuthInterceptor } from './_services/auth.intereceptor';

/* Directives */
import { MiddleClickDirective } from './_directives/middle-click.directive';

    @NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppMaterialModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HomepageComponent,
        HeaderComponent,
        FooterComponent,
        ProductPageComponent,
        BrandRollerComponent,
        NavigationMenuComponent,
        SearchComponent,
        ContactComponent,
        GalleryComponent,
        PricelistComponent,
        SidemenuComponent,
        MiddleClickDirective
    ],
    providers: [
        AdminGuard,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
    })
    export class AppModule { }

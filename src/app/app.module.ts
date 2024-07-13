import { SWIPER_CONFIG, SwiperConfigInterface, SwiperModule } from 'ngx-swiper-wrapper';

/* Core modules */
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NguCarouselModule } from '@ngu/carousel';

/* Directives */
import { MiddleClickDirective } from './_directives/middle-click.directive';
/* Interceptors */
import { AuthInterceptor } from './_services/auth.intereceptor';
/* Guards */
import { AdminGuard } from './admin/admin.guard';
import { AppRoutingModule } from './app-routing.module';
/* App components */
import { AppComponent } from './app.component';
/* App modules */
import { AppMaterialModule } from './app.material.module';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CartComponent } from './pages/cart/cart.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EmploymentComponent } from './pages/employment/employment.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { InfoComponent } from './pages/info/info.component';
import { PricelistComponent } from './pages/pricelist/pricelist.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { SearchComponent } from './pages/search/search.component';
import { ServiceComponent } from './pages/service/service.component';
import { BrandRollerComponent } from './partials/brand-roller/brand-roller.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HeaderComponent } from './partials/header/header.component';
import { NavigationMenuComponent } from './partials/navigation-menu/navigation-menu.component';
import { OrderDialogComponent } from './partials/order-dialog/order-dialog.component';
import { SidemenuComponent } from './partials/sidemenu/sidemenu.component';
import { SnackbarComponent } from './partials/snackbar/snackbar.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppMaterialModule,
    AppRoutingModule,
    NguCarouselModule,
    FontAwesomeModule,
    SwiperModule
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
    InfoComponent,
    CartComponent,
    SidemenuComponent,
    MiddleClickDirective,
    AboutUsComponent,
    ServiceComponent,
    SnackbarComponent,
    OrderDialogComponent,
    EmploymentComponent,
  ],
  entryComponents: [
    SnackbarComponent,
    OrderDialogComponent
  ],
  providers: [
    AdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

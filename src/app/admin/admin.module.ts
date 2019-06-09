/* Core modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* App modules */
import { AdminRoutingModule } from './admin-routing.module';
import { AdminMaterialModule } from './admin.material.module';

/* App compontents */
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { GalleryAdminComponent } from './gallery/gallery-admin.component';
import { GroupsComponent } from './groups/groups.component';
import { PreviewComponent } from './preview/preview.component';
import { PricelistAdminComponent } from './pricelist/pricelist-admin.component';
import { OrdersAdminComponent } from './orders/orders-admin.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule,
    AdminMaterialModule
  ],
  declarations: [
    AdminComponent,
    ProductsComponent,
    CategoriesComponent,
    BrandsComponent,
    GroupsComponent,
    GalleryAdminComponent,
    PricelistAdminComponent,
    OrdersAdminComponent,
    PreviewComponent,
  ]
})
export class AdminModule { }

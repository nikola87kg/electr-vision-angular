/* Core modules */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* App components */
import { AdminComponent } from './admin.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { EmploymentAdminComponent } from './employment/employment-admin.component';
import { GalleryAdminComponent } from './gallery/gallery-admin.component';
import { GroupsComponent } from './groups/groups.component';
import { OrdersAdminComponent } from './orders/orders-admin.component';
import { PdfComponent } from './pdf/pdf.component';
import { PreviewComponent } from './preview/preview.component';
import { PricelistAdminComponent } from './pricelist/pricelist-admin.component';
import { ProductsComponent } from './products/products.component';
import { SlidesComponent } from './slides/slides.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: 'pregled', component: PreviewComponent },
      { path: 'proizvodi', component: ProductsComponent },
      { path: 'galerija', component: GalleryAdminComponent },
      { path: 'cenovnik', component: PricelistAdminComponent },
      { path: 'kategorije', component: CategoriesComponent },
      { path: 'slajdovi', component: SlidesComponent },
      { path: 'narudzbine', component: OrdersAdminComponent },
      { path: 'zaposlenje', component: EmploymentAdminComponent },
      { path: 'brendovi', component: BrandsComponent },
      { path: 'grupe', component: GroupsComponent },
      { path: 'pdf', component: PdfComponent },
      { path: '', redirectTo: 'pregled', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

/* Core modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* App components */
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { BrandsComponent } from './brands/brands.component';
import { GroupsComponent } from './groups/groups.component';
import { PreviewComponent } from './preview/preview.component';
import { GalleryAdminComponent } from './gallery/gallery-admin.component';
import { PricelistAdminComponent } from './pricelist/pricelist-admin.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  { path: '',  component: AdminComponent, children: [
    { path: 'pregled',  component: PreviewComponent },
    { path: 'proizvodi',  component: ProductsComponent, canActivate: [AdminGuard] },
    { path: 'galerija',  component: GalleryAdminComponent, canActivate: [AdminGuard] },
    { path: 'cenovnik',  component: PricelistAdminComponent, canActivate: [AdminGuard] },
    { path: 'kategorije',  component: CategoriesComponent, canActivate: [AdminGuard] },
    { path: 'brendovi',  component: BrandsComponent, canActivate: [AdminGuard] },
    { path: 'grupe',  component: GroupsComponent, canActivate: [AdminGuard] },
    { path: '',  redirectTo: 'pregled', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

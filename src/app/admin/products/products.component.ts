/* Angular */
import { Component, OnInit, ViewChild } from '@angular/core';

/* Services */
import { ProductsService, ProductInterface } from '../../_services/products.service';
import { GroupsService,GroupInterface } from '../../_services/groups.service';
import { BrandsService, BrandInterface } from '../../_services/brands.service';
import { CategoriesService, CategoryInterface } from '../../_services/categories.service';

/* Material */
import { MatSort, MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { SharedService } from '../../_services/shared.service';

/* 3rd party */
import * as slugify from '../../../../node_modules/speakingurl/speakingurl.min.js';

@Component({
    selector: 'px-products',
    templateUrl: './products.component.html'
})

export class ProductsComponent implements OnInit {

    /* Constructor */
    constructor(
        private productService: ProductsService,
        private groupService: GroupsService,
        private categoryService: CategoriesService,
        private brandService: BrandsService,
        public snackBar: MatSnackBar,
        public sharedService: SharedService
    ) { }

    product: ProductInterface;
    displayedColumns = [
        'position',
        'image',
        'name',
        'vip',
        'category',
        'group',
        'brand',
        'created'
    ];;

    screenSize;
    currentIndex: number;
    productList: Array<ProductInterface> ;
    dataSource;

    brandList: Array<BrandInterface>;
    groupList: Array<GroupInterface>;
    categoryList: Array<CategoryInterface>;

    isAddDialogOpen: boolean;
    isDialogEditing: boolean;
    isImageDialogOpen: boolean;
    dialogTitle;

    imageFile: File;
    imagePreview;
    imageID;
    imageindex: number;
    existingImage: string;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    /* INIT */
    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.getGroups();
        this.getBrands();
        this.getProducts();
        this.getCategories();

    }

    /* Dialog  */
    openDialog(editing, singleProduct?, index?) {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje proizvoda';
            this.product = Object.assign({}, singleProduct);
            if (index) {
                this.currentIndex = index;
            }
        }
        if (!editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = false;
            this.dialogTitle = 'Dodavanje proizvoda';
            this.clearForm();
        }
    }

    closeDialog(event) {
        event.stopPropagation();
    this.isAddDialogOpen = false;
        this.clearForm();
    }

    openImageDialog(event, index) {
        event.stopPropagation();
        this.imageFile = null;
        this.imagePreview = null;
        this.imageID = this.productList[index]._id;
        this.existingImage = this.productList[index].image;
        this.imageindex = index;
        this.isImageDialogOpen = true;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog() {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm() {
        this.product = {
            _id: '',
            name: '',
            vip: false,
            slug: '',
            description: '',
            category: { _id: '', name: '', slug: '' },
            group: { _id: '', name: '', slug: '' },
            brand: { _id: '', name: '', slug: '' },
            image: '',
            createdAt: null
        };
    }

    fixSlug(text: string) {
        const options = { maintainCase: false, separator: '-' };
        const mySlug = slugify.createSlug(options);
        const slug = mySlug(text);
        return slug;
    }

    /* Add new product */
    postProduct(product, event) {
        const fixedSlug = this.fixSlug(product.slug);
        product.slug = fixedSlug;
        this.productService.post(product).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getProducts();
                this.openSnackBar({
                    action: 'create',
                    type: 'product'
                });
            }
        );
    }

    /* Update product */
    putProduct(product, event) {
        const fixedSlug = this.fixSlug(product.slug);
        product.slug = fixedSlug;
        this.productService.put(product._id, product).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getProducts();
                this.openSnackBar({
                    action: 'update',
                    type: 'product'
                });
            }
        );
    }

    /* Delete product */
    deleteProduct(id, event) {
        this.productService.delete(id).subscribe(
            (response) => {
                this.productList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.productList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete',
                    type: 'product'
                });
            }
        );
    }

    /* Get products + filter */
    getProducts(categoryFilter?, groupFilter?, brandFilter?) {
        this.productService.get().subscribe(
            (response) => {
                if (categoryFilter) {
                    this.productList = response.filter(
                        p => p.category._id === categoryFilter
                    );
                    if (brandFilter) {
                        this.productList = this.productList.filter(
                            p => p.brand._id === brandFilter
                        );
                    }
                } else if (groupFilter) {
                    this.productList = response.filter(
                        p => p.group._id === groupFilter
                    );
                    if (brandFilter) {
                        this.productList = this.productList.filter(
                            p => p.brand._id === brandFilter
                        );
                    }
                } else if (brandFilter) {
                    this.productList = response.filter(
                        p => p.brand._id === brandFilter
                    );
                } else {
                    this.productList = response;
                }
                this.dataSource = new MatTableDataSource(this.productList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;

            }
        );
    }

    /* Get brands */
    getBrands() {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
        });
    }

    /* Get groups */
    getGroups() {
        this.groupService.get().subscribe(response => {
            this.groupList = response;
        });
    }

    /* Get categories */
    getCategories() {
        this.categoryService.get().subscribe(response => {
            this.categoryList = response;
        });
    }

    /* Image upload */

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    postImage() {
        const formData = new FormData();
        const filename = this.imageFile.name ;
        formData.append('image', this.imageFile, filename);

        const thisProduct = this.productList[this.imageindex];
        const productId = thisProduct._id;
        thisProduct.image = filename;

        this.productService.put(productId, thisProduct).subscribe(
            (response) => {
                this.productService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getProducts();
                        this.openSnackBar({
                            action: 'update2',
                            type: 'image'
                        });
                    }
                );
            });
    }

    /* Snackbar */
    openSnackBar(object) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        duration: 2000,
        data: object,
      });
    }
}


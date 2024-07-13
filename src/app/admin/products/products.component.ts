
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faArrowCircleLeft, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

import * as slugify from '../../../../node_modules/speakingurl/speakingurl.min.js';
import { BrandInterface, BrandsService } from '../../_services/brands.service';
import { CategoriesService, CategoryInterface } from '../../_services/categories.service';
import { GroupInterface, GroupsService } from '../../_services/groups.service';
import { PdfService } from '../../_services/pdf.service';
import { ProductInterface, ProductsService } from '../../_services/products.service';
import { SharedService } from '../../_services/shared.service';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';

@Component({
    selector: 'px-products',
    templateUrl: './products.component.html'
})

export class ProductsComponent implements OnInit {

    @ViewChild('categoryFilter', { static: true }) categoryFilter;
    @ViewChild('groupFilter', { static: true }) groupFilter;
    @ViewChild('brandFilter', { static: true }) brandFilter;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    faPlusCircle = faPlusCircle;

    faArrowCircleLeft = faArrowCircleLeft;
    faTimes = faTimes;

    product: ProductInterface;
    displayedColumns = [
        'position',
        'image',
        'name',
        'price',
        'catalog',
        'counter',
        'vip',
        'category',
        'group',
        'brand',
        'created'
    ];

    screenSize;
    currentIndex: number;
    productList: Array<ProductInterface>;
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

    /* Constructor */
    constructor(
        private productService: ProductsService,
        private groupService: GroupsService,
        private categoryService: CategoriesService,
        private brandService: BrandsService,
        public snackBar: MatSnackBar,
        public sharedService: SharedService,
        public pdfService: PdfService,
    ) { }

    /* INIT */
    ngOnInit(): void {
        this.sharedService.screenSize$$.subscribe(
            (result => this.screenSize = result)
        );
        this.getGroups();
        this.getBrands();
        this.getProducts();
        this.getCategories();

    }

    /* Dialog  */
    openDialog(editing, singleProduct?, index?): void {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje proizvoda';
            this.product = Object.assign({}, singleProduct);
            if (index !== undefined) {
                const pageSize = this.paginator.pageSize;
                const pageIndex = this.paginator.pageIndex;
                const realIndex = pageSize * pageIndex + index;
                this.currentIndex = realIndex;
            }
        }
        if (!editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = false;
            this.dialogTitle = 'Dodavanje proizvoda';
            this.clearForm();
        }
    }

    closeDialog(event): void {
        event.stopPropagation();
        this.isAddDialogOpen = false;
        this.clearForm();
    }

    openImageDialog(event, index): void {
        event.stopPropagation();
        const pageSize = this.paginator.pageSize;
        const pageIndex = this.paginator.pageIndex;
        const realIndex = pageSize * pageIndex + index;
        this.imageFile = null;
        this.imagePreview = null;
        this.isImageDialogOpen = true;
        this.imageID = this.productList[realIndex]._id;
        this.existingImage = this.productList[realIndex].image;
        this.imageindex = realIndex;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog(): void {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm(): void {
        this.product = {
            _id: '',
            name: '',
            price: '',
            catalog: '',
            counter: null,
            vip: false,
            slug: '',
            description: '',
            category: { _id: '', name: '', slug: '' },
            group: { _id: '', name: '', slug: '' },
            brand: { _id: '', name: '', slug: '', image: undefined },
            image: '',
            createdAt: null
        };
    }

    fixSlug(text: string): string {
        const options = { maintainCase: false, separator: '-' };
        const mySlug = slugify.createSlug(options);
        const slug = mySlug(text);
        return slug;
    }

    /* Add new product */
    postProduct(product, event): void {
        const fixedSlug = this.fixSlug(product.slug);
        product.slug = fixedSlug;
        this.productService.post(product).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getProducts(this.categoryFilter.value, this.groupFilter.value, this.brandFilter.value);
                this.openSnackBar({
                    action: 'create',
                    type: 'product'
                });
            }
        );
    }

    /* Update product */
    putProduct(product, event): void {
        const fixedSlug = this.fixSlug(product.slug);
        product.slug = fixedSlug;
        this.productService.put(product._id, product).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getProducts(this.categoryFilter.value, this.groupFilter.value, this.brandFilter.value);
                this.openSnackBar({
                    action: 'update',
                    type: 'product'
                });
            }
        );
    }

    /* Delete product */
    deleteProduct(id, event): void {
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
    getProducts(categoryFilter?, groupFilter?, brandFilter?): void {
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
    getBrands(): void {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
        });
    }

    /* Get groups */
    getGroups(): void {
        this.groupService.get().subscribe(response => {
            this.groupList = response;
        });
    }

    /* Get categories */
    getCategories(): void {
        this.categoryService.get().subscribe(response => {
            this.categoryList = response;
        });
    }

    /* Image upload */

    onImagePicked(event: Event): void {
        const file = (event.target as HTMLInputElement).files[0];
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    postImage(): void {
        const formData = new FormData();
        const filename = this.imageFile.name;
        formData.append('image', this.imageFile, filename);

        const thisProduct = this.productList[this.imageindex];
        const productId = thisProduct._id;
        thisProduct.image = filename;

        this.productService.put(productId, thisProduct).subscribe(
            (response) => {
                this.productService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getProducts(this.categoryFilter.value, this.groupFilter.value, this.brandFilter.value);
                        this.openSnackBar({
                            action: 'update2',
                            type: 'image'
                        });
                    }
                );
            });
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: object,
        });
    }

    onProduct($event, item) {
        $event.stopPropagation();
        const listNames = this.pdfService.pdfList.map(I => I.name);
        const selected = item.name;

        if (listNames.includes(selected)) {
            return;
        }

        const article = {
            id: item._id,
            name: item.name,
            catalog: item.catalog,
            price: item.fixPrice,
            amount: 1,
            totalPrice: item.fixPrice,
            rabat: 0,
            image: item.image,
            priceAfterRabat: item.fixPrice
        };

        this.pdfService.pdfList = [...this.pdfService.pdfList, article];
    }

    isAdded(item) {
        const index = this.pdfService.pdfList.findIndex(l => l.name === item.name);
        return index > -1;
    }
}


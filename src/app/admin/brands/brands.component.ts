import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faArrowCircleLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as slugify from '../../../../node_modules/speakingurl/speakingurl.min.js';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { BrandInterface, BrandsService } from '../../_services/brands.service';
import { SharedService } from '../../_services/shared.service';

@Component({
    selector: 'px-brands',
    templateUrl: './brands.component.html'
})

export class BrandsComponent implements OnInit {

    faTimes = faTimes;
    faArrowCircleLeft = faArrowCircleLeft;

    /* Constructor */
    constructor(
        private brandService: BrandsService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) { }

    brand: BrandInterface;
    displayedColumns = ['position', 'image', 'name', 'vip', 'slug', 'created'];

    screenSize;
    brandList: Array<BrandInterface>;
    currentIndex: number;
    dataSource;

    isAddDialogOpen: boolean;
    isImageDialogOpen: boolean;
    isDialogEditing: boolean;
    dialogTitle: string;

    imageFile: File;
    imagePreview;
    imageID;
    imageindex: number;
    existingImage: string;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    /* INIT */
    ngOnInit(): void {
        this.sharedService.screenSize$$.subscribe(
            result => this.screenSize = result
        );
        this.getBrands();
    }

    /* Dialog  */
    openDialog(editing, singleBrand?, index?): void {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje brenda';
            this.brand = Object.assign({}, singleBrand);
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
            this.dialogTitle = 'Dodavanje brenda';
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
        this.imageID = this.brandList[realIndex]._id;
        this.existingImage = this.brandList[realIndex].image;
        this.imageindex = realIndex;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog(): void {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm(): void {
        this.brand = {
            _id: '',
            name: '',
            slug: '',
            description: '',
            vip: false,
            image: '',
            createdAt: null
        };
    }

    fixSlug(text: string): void {
        const options = { maintainCase: false, separator: '-' };
        const mySlug = slugify.createSlug(options);
        const slug = mySlug(text);
        return slug;
    }

    /* Add new brand */
    postBrand(brand, event): void {
        const fixedSlug = this.fixSlug(brand.slug);
        brand.slug = fixedSlug;
        this.brandService.post(brand).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getBrands();
                this.openSnackBar({ action: 'create', type: 'brand' });
            }
        );
    }

    /* Update brand */
    putBrand(brand, event): void {
        const fixedSlug = this.fixSlug(brand.slug);
        brand.slug = fixedSlug;
        this.brandService.put(brand._id, brand).subscribe(
            (data) => {
                this.closeDialog(event);
                this.getBrands();
                this.openSnackBar({
                    action: 'update',
                    type: 'brand'
                });
            }
        );
    }

    /* Delete Brand */
    deleteBrand(id, event): void {
        this.brandService.delete(id).subscribe(
            (data) => {
                this.brandList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.brandList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete',
                    type: 'brand'
                });
            }
        );
    }

    /* Get brand */
    getBrands(): void {
        this.brandService.get().subscribe(response => {
            this.brandList = response;
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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

        const thisBrand = this.brandList[this.imageindex];
        const brandId = thisBrand._id;
        thisBrand.image = filename;

        this.brandService.put(brandId, thisBrand).subscribe(
            (response) => {
                this.brandService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getBrands();
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
}

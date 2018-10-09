/* Angular */
import { Component, OnInit, ViewChild } from '@angular/core';

/* Services */
import { BrandsService } from '../../_services/brands.service';

/* Material */
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '../../../../node_modules/@angular/material';
import { SharedService } from '../../_services/shared.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

/* Interfaces */
import { BrandModel, BrandColumns } from '../admin.interfaces';

/* 3rd party */
import * as slugify from '../../../../node_modules/speakingurl/speakingurl.min.js';

/* Decorator */
@Component({
    selector: 'px-brands',
    templateUrl: './brands.component.html'
})

export class BrandsComponent implements OnInit {

    /* Constructor */
    constructor(
        private brandService: BrandsService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) {}

    brand: BrandModel;
    displayedColumns = BrandColumns;

    screenSize;
    brandList: Array<BrandModel>;
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

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    /* INIT */
    ngOnInit() {
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.getBrands();
    }

    /* Dialog  */
    openDialog(editing, singleBrand?, index?) {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje brenda';
            this.brand = Object.assign({}, singleBrand);
            if (index) {
                this.currentIndex = index;
            }
        }
        if (!editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = false;
            this.dialogTitle = 'Dodavanje brenda';
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
        this.isImageDialogOpen = true;
        this.imageID = this.brandList[index]._id;
        this.existingImage = this.brandList[index].image;
        this.imageindex = index;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog() {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm() {
        this.brand = {
            _id: '',
            name: '',
            slug: '',
            description: '',
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

    /* Add new brand */
    postBrand(brand, event) {
        const fixedSlug = this.fixSlug(brand.slug);
        brand.slug = fixedSlug;
        this.brandService.post(brand).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getBrands();
                this.openSnackBar({
                    action: 'create',
                    type: 'brand'
                });
            }
        );
    }

    /* Update brand */
    putBrand(brand, event) {
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
    deleteBrand(id, event) {
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
    getBrands() {
        this.brandService.get().subscribe(response => {
            this.brandList = response.object;
            this.dataSource = new MatTableDataSource(this.brandList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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
    openSnackBar(object) {
      this.snackBar.openFromComponent(SnackbarComponent, {
        duration: 2000,
        data: object,
      });
    }
}

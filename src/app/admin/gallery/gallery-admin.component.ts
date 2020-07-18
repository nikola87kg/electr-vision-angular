import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { GalleryInterface, GalleryService } from '../../_services/gallery.service';
import { SharedService } from '../../_services/shared.service';

@Component({
    selector: 'px-gallery-admin',
    templateUrl: './gallery-admin.component.html'
})

export class GalleryAdminComponent implements OnInit {

    /* Constructor */
    constructor(
        private galleryService: GalleryService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) {}

    gallery: GalleryInterface;
    displayedColumns = [ 'position', 'image', 'name', 'description', 'gallery', 'created' ];

    screenSize;
    galleryList: Array<GalleryInterface>;
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
        this.sharedService.screenSize.subscribe(
            (result => this.screenSize = result)
        );
        this.getGalleries();
    }

    /* Dialog  */
    openDialog(editing, singleGallery?, index?): void {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje slike';
            this.gallery = Object.assign({}, singleGallery);
            if (index) {
                this.currentIndex = index;
            }
        }
        if (!editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = false;
            this.dialogTitle = 'Dodavanje stavke';
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
        this.isImageDialogOpen = true;
        this.imageID = this.galleryList[index]._id;
        this.existingImage = this.galleryList[index].imagePath;
        this.imageindex = index;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog(): void {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm(): void {
        this.gallery = {
            _id: '',
            name: '',
            description: '',
            gallery: '',
            imagePath: '',
            createdAt: null
        };
    }

    /* Add new gallery */
    postGallery(gallery, event): void {
        this.galleryService.post(gallery).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getGalleries();
                this.openSnackBar({
                    action: 'create2',
                    type: 'gallery'
                });
            }
        );
    }

    /* Update gallery */
    putGallery(gallery, event): void {
        this.galleryService.put(gallery._id, gallery).subscribe(
            (data) => {
                this.closeDialog(event);
                this.getGalleries();
                this.openSnackBar({
                    action: 'update2',
                    type: 'gallery'
                });
            }
        );
    }

    /* Delete Gallery */
    deleteGallery(id, event): void {
        this.galleryService.delete(id).subscribe(
            (data) => {
                this.galleryList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.galleryList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete2',
                    type: 'gallery'
                });
            }
        );
    }

    /* Get gallery */
    getGalleries(): void {
        this.galleryService.get().subscribe(response => {
            this.galleryList = response;
            this.dataSource = new MatTableDataSource(this.galleryList);
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
        const filename = this.imageFile.name ;
        formData.append('image', this.imageFile, filename);

        const thisGallery = this.galleryList[this.imageindex];
        const galleryId = thisGallery._id;
        thisGallery.imagePath = filename;

        this.galleryService.put(galleryId, thisGallery).subscribe(
            (response) => {
                this.galleryService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getGalleries();
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

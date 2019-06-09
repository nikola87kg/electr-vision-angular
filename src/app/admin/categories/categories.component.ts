/* Angular */
import { Component, OnInit, ViewChild } from '@angular/core';

/* Services */
import { CategoriesService, CategoryInterface } from '../../_services/categories.service';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SharedService } from '../../_services/shared.service';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';

/* 3rd party */
import * as slugify from '../../../../node_modules/speakingurl/speakingurl.min.js';

@Component({
    selector: 'px-categories',
    templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

    /* Constructor */
    constructor(
        private categoryService: CategoriesService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) {}

    category: CategoryInterface;
    displayedColumns = [ 'position', 'image', 'name', 'slug', 'created' ];;

    screenSize: string;
    categoryList: Array<CategoryInterface>;
    currentIndex: number;
    dataSource;

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
        this.getCategories();
    }
    
    fixSlug(text: string) {
        const options = { maintainCase: false, separator: '-' };
        const mySlug = slugify.createSlug(options);
        const slug = mySlug(text);
        return slug;
    }

    /* Dialog  */
    openDialog(editing, singleCategory?, index?) {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje kategorije';
            this.category = Object.assign({}, singleCategory);
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
            this.dialogTitle = 'Dodavanje kategorije';
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
        const pageSize = this.paginator.pageSize;
        const pageIndex = this.paginator.pageIndex;
        const realIndex = pageSize * pageIndex + index;
        this.imageFile = null;
        this.imagePreview = null;
        this.isImageDialogOpen = true;
        this.imageID = this.categoryList[realIndex]._id;
        this.existingImage = this.categoryList[realIndex].image;
        this.imageindex = realIndex;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog() {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm() {
        this.category = {
            _id: '',
            name: '',
            slug: '',
            description: '',
            image: '',
            createdAt: null
        };
    }
    /* Add new category */
    postCategory(category, event) {
        const fixedSlug = this.fixSlug(category.slug);
        category.slug = fixedSlug;
        this.categoryService.post(category).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getCategories();
                this.openSnackBar({
                    action: 'create2',
                    type: 'category'
                });
            });
    }

    /* Update category */
    putCategory(category, event) {
        const fixedSlug = this.fixSlug(category.slug);
        category.slug = fixedSlug;
        this.categoryService.put(category._id, category).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getCategories();
                this.openSnackBar({
                    action: 'update2',
                    type: 'category'
                });
            }
        );
    }

    /* Delete category */
    deleteCategory(id, event) {
        this.categoryService.delete(id).subscribe(
            (response) => {
                this.categoryList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.categoryList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete2',
                    type: 'category'
                });
            }
        );
    }

    /* Get category */
    getCategories() {
        this.sharedService.categoryList.subscribe(response => {
            if(response) {
                this.categoryList = response;
                this.dataSource = new MatTableDataSource(this.categoryList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            } else {
                setTimeout( ()=> {
                    this.getCategories();
                }, 1)
            }
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

        const thisCategory = this.categoryList[this.imageindex];
        const catId = thisCategory._id;
        thisCategory.image = filename;

        this.categoryService.put(catId, thisCategory).subscribe(
            (response) => {
                this.categoryService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getCategories();
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

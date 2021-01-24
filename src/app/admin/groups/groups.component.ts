import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faArrowCircleLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as slugify from '../../../../node_modules/speakingurl/speakingurl.min.js';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { CategoriesService, CategoryInterface } from '../../_services/categories.service';
import { GroupInterface, GroupsService } from '../../_services/groups.service';
import { SharedService } from '../../_services/shared.service';


@Component({
    selector: 'px-groups',
    templateUrl: './groups.component.html'
})

export class GroupsComponent implements OnInit {

    faTimes = faTimes;
    faArrowCircleLeft = faArrowCircleLeft;

    /* Constructor */
    constructor(
        private groupService: GroupsService,
        private categoryService: CategoriesService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) { }

    subcategory: GroupInterface;
    displayedColumns = ['position', 'image', 'name', 'category', 'created'];

    screenSize;
    groupList: Array<GroupInterface>;
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

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    /* INIT */
    ngOnInit(): void {
        this.sharedService.screenSize$$.subscribe(
            (result => this.screenSize = result)
        );
        this.getGroups();
        this.getCategories();
    }

    fixSlug(text: string): string {
        const options = { maintainCase: false, separator: '-' };
        const mySlug = slugify.createSlug(options);
        const slug = mySlug(text);
        return slug;
    }

    /* Dialog  */
    openDialog(editing, singleGroup?, index?): void {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje potkategorije';
            this.subcategory = Object.assign({}, singleGroup);
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
            this.dialogTitle = 'Dodavanje potkategorije';
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
        this.imageID = this.groupList[realIndex]._id;
        this.existingImage = this.groupList[realIndex].image;
        this.imageindex = realIndex;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog(): void {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm(): void {
        this.subcategory = {
            _id: '',
            name: '',
            slug: '',
            description: '',
            image: '',
            category: { _id: '', name: '', slug: '' },
            createdAt: null
        };
    }

    /* Add new group */
    postGroup(group, event): void {
        const fixedSlug = this.fixSlug(group.slug);
        group.slug = fixedSlug;
        this.groupService.post(group).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getGroups();
                this.openSnackBar({
                    action: 'create2',
                    type: 'group'
                });
            }
        );
    }

    /* Update group */
    putGroup(group, event): void {
        const fixedSlug = this.fixSlug(group.slug);
        group.slug = fixedSlug;
        this.groupService.put(group._id, group).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getGroups();
                this.openSnackBar({
                    action: 'update2',
                    type: 'group'
                });
            }
        );
    }

    /* Delete group */
    deleteGroup(id, event): void {
        this.groupService.delete(id).subscribe(
            (response) => {
                this.groupList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.groupList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete2',
                    type: 'group'
                });
            }
        );
    }

    /* Get groups */
    getGroups(filter?): void {
        this.groupService.get().subscribe(response => {
            if (filter) {
                this.groupList = response.filter(
                    g => g.category._id === filter
                );
            } else {
                this.groupList = response;
            }
            this.dataSource = new MatTableDataSource(this.groupList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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

        const thisGroup = this.groupList[this.imageindex];
        const groupId = thisGroup._id;
        thisGroup.image = filename;

        this.groupService.put(groupId, thisGroup).subscribe(
            (response) => {
                this.groupService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getGroups();
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

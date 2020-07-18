import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorIntlSerb } from './admin.material.translations';


const adminMaterialModules = [
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatGridListModule
];

@NgModule({
    imports: [...adminMaterialModules],
    exports: [...adminMaterialModules],
    providers: [
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSerb }
    ]
})
export class AdminMaterialModule { }

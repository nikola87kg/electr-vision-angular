import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatCardModule, MatSelectModule, MatOptionModule, MatTableModule, MatGridListModule, MatButtonToggleModule, MatDialogModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


const materialModules = [
    MatTableModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule,
    MatOptionModule,
    MatToolbarModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule
];

@NgModule({
    imports: [...materialModules],
    exports: [...materialModules]
})
export class AppMaterialModule { }

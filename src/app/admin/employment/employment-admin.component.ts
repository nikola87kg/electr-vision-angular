import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarComponent } from 'src/app/partials/snackbar/snackbar.component';
import { EmploymentService } from 'src/app/_services/employment.service';
import { SharedService } from 'src/app/_services/shared.service';
import { EmploymentInterface } from './../../_services/employment.service';

@Component({
  selector: 'px-employment-admin',
  templateUrl: './employment-admin.component.html'
})
export class EmploymentAdminComponent implements OnInit {

  /* Constructor */
  constructor(
    private employmentService: EmploymentService,
    public sharedService: SharedService,
    public snackBar: MatSnackBar,
  ) { }

  employmentList: Array<EmploymentInterface> = [];
  displayedColumns = ['position', 'name', 'phone', 'email', 'school', 'text', 'experience', 'delete'];

  screenSize;
  currentIndex: number;
  dataSource;

  isAddDialogOpen: boolean;
  isDialogEditing: boolean;
  dialogTitle: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.sharedService.screenSize$$.subscribe(
      (result => this.screenSize = result)
    );
    this.getEmployments();
  }

  deleteEmployment(id): void {
    this.employmentService.delete(id).subscribe(
      (data) => {
        this.employmentList.splice(this.currentIndex, 1);
        this.dataSource = new MatTableDataSource(this.employmentList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.openSnackBar({
          action: 'delete',
          type: 'employment'
        });
      }
    );
  }

  getEmployments(): void {
    this.employmentService.get().subscribe(response => {
      this.employmentList = response;
      this.dataSource = new MatTableDataSource(this.employmentList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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

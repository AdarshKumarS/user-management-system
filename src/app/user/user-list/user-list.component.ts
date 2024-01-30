import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../data.service';
import { UserUpsertComponent } from '../user-upsert/user-upsert.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  displayedColumns: string[] = [
    'Sr.No.',
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'action'
  ];

  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private service: DataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getUserList();
  }

  openAddUserForm() {
    const dialogRef = this.dialog.open(UserUpsertComponent,{    
      position: {
      top:'5%',
      right:'5%',
    },
    disableClose: true,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
        }
      },
    });
  }

  getUserList() {
    this.spinner.show();
    this.service.getUserList().subscribe({
      next: (res : any) => {
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err : any) =>{
        this.spinner.hide();
        this.toastr.error("Some error occured.","Error")
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id: number) {
    this.spinner.show();
    this.service.deleteUser(id).subscribe({
      next: (res) => {
        this.spinner.hide();
        this.toastr.success("User details deleted successfully.","Success");
        this.getUserList();
      },
      error: (err : any) =>{
        this.spinner.hide();
        this.toastr.error("Some error occured.","Error")
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(UserUpsertComponent, {
      position: {
        top:'5%',
        right:'20%',
      },
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
        }
      },
    });
  }

  deleteConfirmation(id:any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      height: '200px',
      position: {
        top:'5%',
        right:'20%',
      },
      disableClose: true,
      data: { 
        dialogHeader:"Please Confirm?", 
        dialogDiscription:"Data will be permanently delete from database.", 
        actionButton: "Delete", 
        closeButton: "Cancel" 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.deleteUser(id);
      }
    });
}
}

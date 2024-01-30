import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from '../../data.service';
import { ValidationService } from '../../validation.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from '../user.interface';

@Component({
  selector: 'app-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrl: './user-upsert.component.scss'
})
export class UserUpsertComponent {
  userForm: FormGroup;
  userList: any;

  constructor(
    private fb: FormBuilder,
    private service: DataService,
    private dialogRef: MatDialogRef<UserUpsertComponent>,
    private dialog: MatDialog,
    private validation: ValidationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['',[Validators.required]],
      email: ['',[Validators.required,this.validation.checkEmail()]],
      phone: ['',[Validators.required,this.validation.checkPhone()]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.userForm.patchValue(this.data);
    this.getUserList();
  }

  getUserList() {
    this.spinner.show();
    this.service.getUserList().subscribe({
      next: (res : any) => {
        this.spinner.hide();
        this.userList = res;
      },
      error: (err : any) =>{
        this.spinner.hide();
        this.toastr.error("Some error occured.","Error")
      }
    });
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      if (this.data) {
       let header = "Please Confirm?";
       let discription = "Do You Really Want To Update This Data.";
       this.updateUserConfirmation(header,discription,this.data['id'], this.userForm.value);
      } 
      else {
        let alreadyExist = this.userList.find((x:any) => x.email == this.userForm['value']['email'] && x.phone == this.userForm['value']['phone']);
        if(!alreadyExist){
          this.addUser();
        }
        else{
          let header = "User Already Exist!";
          let discription = "Do You Want To Update User's Details?";
          this.updateUserConfirmation(header,discription,alreadyExist['id'], this.userForm.value);
        }
      }
    }
    else{
      this.toastr.info("Please fill all required field.","Info");
    }
  }

  updateUserConfirmation(header: string,desc:string,id:number,data:User){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      height: '200px',
      position: {
        top:'5%',
        right:'20%',
      },
      disableClose: true,
      data: { 
        dialogHeader: header, 
        dialogDiscription: desc, 
        actionButton: "Update", 
        closeButton: "Cancel" 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.updateUser(id,data);
      }
    });
  }

  addUser(){
    this.spinner.show();
    this.service.addUserDetails(this.userForm.value).subscribe({
      next: (val: any) => {
        this.spinner.hide();
        this.dialogRef.close(true);
        this.toastr.success("User details added successfully.","Success");
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error("Some error occured.","Error");
      },
    });
  }

  updateUser(id:number, data:User){
    this.spinner.show();
    this.service.updateUserDetails(id,data).subscribe({
      next: (val: any) => {
        this.spinner.hide();
        this.dialogRef.close(true);
        this.toastr.success("User details updated successfully.","Success");
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error("Some error occured.","Error");
      },
    });
  }
}



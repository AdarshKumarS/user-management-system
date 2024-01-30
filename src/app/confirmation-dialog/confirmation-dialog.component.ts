import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  actionButton : any;
  closeButton : any;
  dialogDiscription : any;
  dialogHeader : any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData : ConfirmationDialogComponent,
    public dialogRef : MatDialogRef<ConfirmationDialogComponent>,
    ) {}

  ngOnInit(){ 
  }

  done(){
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.scss']
})
export class ConfirmActionComponent implements OnInit {
  msg: any;

  constructor(private dialogRef: MatDialogRef<ConfirmActionComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.msg = data.msg;
  }

  ngOnInit(): void {

  }

}

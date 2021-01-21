import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-google-spreadsheet-warn',
  templateUrl: './google-spreadsheet-warn.component.html',
  styleUrls: ['./google-spreadsheet-warn.component.scss']
})
export class GoogleSpreadsheetWarnComponent implements OnInit {

  status;
  desc;
  icon: any;
  constructor(private dialogRef: MatDialogRef<GoogleSpreadsheetWarnComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.status = data.status;
    this.desc = data.desc;
    this.icon = data.icon;
   }

  ngOnInit() {

  }

  continue(){
    this.dialogRef.close();
  }

}

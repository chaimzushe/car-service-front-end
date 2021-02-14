import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-waiting',
  templateUrl: './add-to-waiting.component.html',
  styleUrls: ['./add-to-waiting.component.scss']
})
export class AddToWaitingComponent implements OnInit {
  selectedReason;
  location: any;
  note: any;
  timeIn: any;
  constructor(
    private dialogRef: MatDialogRef<AddToWaitingComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if(!data.info) data.info = {};
    this.selectedReason = data.info.reason;
    this.location = data.info.location;
    this.note = data.info.note;
    this.timeIn = data.info.timeIn;
  }

  ngOnInit(): void {
  }

  apply() {
    let waitingInfo = {
      reason: this.selectedReason,
      location: this.location,
      note: this.note,
      timeIn:  this.timeIn
    }
    this.dialogRef.close(waitingInfo);
  }

}





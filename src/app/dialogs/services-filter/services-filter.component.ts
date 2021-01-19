import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-services-filter',
  templateUrl: './services-filter.component.html',
  styleUrls: ['./services-filter.component.scss']
})
export class ServicesFilterComponent implements OnInit {
  selectedUser = null;
  startDateSelected = null;
  endDateSelected = null;
  mechanics = [];
  constructor(
    private dialogRef: MatDialogRef<ServicesFilterComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.mechanics = data.mechanics;
    if(data.filter.startDate) this.startDateSelected = new Date(data.filter.startDate);
    if(data.filter.endDate) this.endDateSelected = new Date(data.filter.endDate);
    if(data.filter.user) this.selectedUser = data.filter.user;
  }

  ngOnInit(): void {
  }

  setFilter() {
    this.dialogRef.close({ user: this.selectedUser,
      startDate: this.startDateSelected, endDate: this.endDateSelected });
  }

}

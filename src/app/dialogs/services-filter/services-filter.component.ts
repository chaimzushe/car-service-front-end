import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-services-filter',
  templateUrl: './services-filter.component.html',
  styleUrls: ['./services-filter.component.scss']
})
export class ServicesFilterComponent implements OnInit {
  selectedUser = null;
  statusSelected = null;
  statuses = ['COMPLETED', 'IN PROGRESS']
  startDateSelected = null;
  endDateSelected = null;
  mechanics = [];
  constructor(
    private dialogRef: MatDialogRef<ServicesFilterComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.mechanics = data.mechanics;
  }

  ngOnInit(): void {
  }

  setFilter() {
    this.dialogRef.close({ user: this.selectedUser, status: this.statusSelected,
      startDate: this.startDateSelected, endDate: this.endDateSelected });
  }

}

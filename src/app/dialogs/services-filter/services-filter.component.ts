import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CarServiceService } from 'src/app/services/car-service.service';

@Component({
  selector: 'app-services-filter',
  templateUrl: './services-filter.component.html',
  styleUrls: ['./services-filter.component.scss']
})
export class ServicesFilterComponent implements OnInit {
  selectedUser = null;
  startDateSelected = null;
  endDateSelected = null;
  selectedVisitType = null;
  mechanics = [];
  visitColorMapper = {};
  visitTypes: string[];
  constructor(
    private carServiceService: CarServiceService,
    private dialogRef: MatDialogRef<ServicesFilterComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.mechanics = data.mechanics;
    this.visitColorMapper = this.carServiceService.visitTypesColor;
    this.visitTypes = Object.keys(this.carServiceService.visitTypesColor);
    if (data.filter.startDate) this.startDateSelected = new Date(data.filter.startDate);
    if (data.filter.endDate) this.endDateSelected = new Date(data.filter.endDate);
    if (data.filter.user) this.selectedUser = data.filter.user;
    if (data.filter.visitType) this.selectedVisitType = data.filter.visitType;
  }

  ngOnInit(): void {
  }

  setFilter() {
    this.dialogRef.close({
      visitType: this.selectedVisitType,
      user: this.selectedUser,
      startDate: this.startDateSelected,
      endDate: this.endDateSelected
    });
  }

}

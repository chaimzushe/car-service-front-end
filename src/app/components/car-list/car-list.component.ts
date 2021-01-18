import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import {  subNavInfo, CarFullInfo } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit, OnDestroy {
  subs: Subscription[]= [];
  subNavInfo: subNavInfo = {
    actionText: 'New Car',
    actionLink: ['edit', 'new'],
    backLink: '/home',
    hideFilter: true,
     hideSearch: true
  }
  girdView =true;
  rowData: any;
  constructor(private carService: CarService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.subs.forEach(s=> s.unsubscribe())
  }
  cars: CarFullInfo[] = [];
  noItemsText = "Loading...";
  defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    enableRowGroup: true,
    headerCheckboxSelectionFilteredOnly: true,
    suppressPaste: true,

  };

  toggleGridView(){
    this.girdView = !this.girdView;
  }

  columnDefs = [
    { field: 'car_id' , width: 100},
    { field: 'vin' },
    { field: 'model' },
    { field: 'year', width: 150  },
    { field: 'color' },
    { field: 'driver' },
  ];
  async ngOnInit() {
    this.cars = await this.carService.getAllCarsFullInfo(null).toPromise() as CarFullInfo[];
    this.setupRowData(this.cars)
  }
  setupRowData(cars) {
    this.rowData = cars;
  }

  navigateToEdit(car) {
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  viewItem(car){
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  deleteItem(car, i){
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this car?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.cars.splice(i, 1);
      let removeSub = this.carService.removeCar(car._id).subscribe(x => {});
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

}

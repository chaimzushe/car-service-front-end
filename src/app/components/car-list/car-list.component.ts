import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { ICar, subNavInfo, CarFullInfo } from 'src/app/models/car.model';
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
    gridView: true
  }
  girdView =false;
  rowData: any;
  constructor(private carService: CarService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.subs.forEach(s=> s.unsubscribe())
  }
  cars: CarFullInfo[] = [];
  noItemsText = "No cars found";
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
    { field: 'car_id' },
    { field: 'purchase_date' },
    { field: 'vin' },
    { field: 'owner' },
    { field: 'model' },
    { field: 'year', sortable: true  },
    { field: 'color' },
    { field: 'base' },
    { field: 'inspct_date' },
    { field: 'driver' },
    { field: 'turnover' },
    { field: 'stage' },
    { field: 'ituraun_id' },
    { field: 'lien' },
    { field: 'add' },
    { field: 'car_desc' },
    { field: 'purchasePrice' },
    { field: '2015Policy' },
    { field: 'weeklyCharge' },
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { subNavInfo, CarFullInfo } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  subNavInfo: subNavInfo = {
    actionText: 'New Car',
    actionLink: ['edit', 'new'],
    backLink: '/home',
    hideFilter: true
  }
  filter: any = { skip: 0 };
  filteredCars: any[] = [];
  constructor(private carService: CarService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }
  cars: CarFullInfo[] = [];
  noItemsText = "Loading...";
  searchWord = ""



   ngOnInit() {
    this.loadCars();
  }
  async loadCars(append = false) {
    let cars = await this.carService.getCarTypeAhead(this.searchWord , this.filter ).toPromise() as CarFullInfo[];
    let mappedCars = this.mapCarsToCard(cars) as [];
    if(append){
      this.filteredCars.push(...mappedCars);
    } else {
      this.filteredCars = mappedCars;
    }
    if(this.filteredCars.length === 0) this.noItemsText = "No cars found";
  }

  mapCarsToCard(cars){
    return cars.map(c=> {
      return ({
        _id: c._id,
        header: c.car_id,
        middles: [
          { key: 'VIN', value: `${c.vin}` },
          { key: 'Model', value: `${c.model}` },
          { key: 'Year', value: `${c.year}` },
          { key: 'Color', value: `${c.color}` },
        ],
        bottom: (c.driver),
        warn: (c.driver === "STAGE 13")
      })
    });
  }

  navigateToEdit(car) {
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  viewItem(car) {
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  deleteItem(car, i) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this car?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.cars = this.cars.filter(c => c.car_id !== car.header)
      this.filteredCars = this.filteredCars.filter(c => c.header !== car.header);
      let removeSub = this.carService.removeCar(car._id).subscribe(x => { });
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

  onScroll(){
    this.filter.skip += 10;
    this.loadCars(true);
  }

  search(e){
    this.searchWord = e;
    this.filter.skip = 0;
    this.loadCars();
  }

}

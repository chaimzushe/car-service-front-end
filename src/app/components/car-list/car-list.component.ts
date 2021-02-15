import { Component, OnDestroy, OnInit } from '@angular/core';
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

  list: any = { header: 'Cars', items: [], noItemsText: 'Loading...' };
  filter: any = { skip: 0 };
  constructor(private carService: CarService, private router: Router, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }
  cars: CarFullInfo[] = [];
  searchWord = "";

  ngOnInit() {
    this.loadCars();
  }
  async loadCars(append = false) {
    let cars = await this.carService.getCarTypeAhead(this.searchWord, this.filter).toPromise() as CarFullInfo[];
    let mappedCars = this.mapCarsToCard(cars) as [];
    if (append) {
      this.list.items.push(...mappedCars);
    } else {
      this.list.items = mappedCars;
    }
    if (this.list.items.length === 0) this.list.noItemsText = "No cars found";
  }

  mapCarsToCard(cars) {
    return cars.map(c => {
      return ({
        _id: c._id,
        header: `Car Number: ${c.car_id}`,
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



  async deleteItem(car) {
    this.cars = this.cars.filter(c => c.car_id !== car.header)
    this.list.items = this.list.items.filter(c => c.header !== car.header);
    if (this.list.items.length === 0) this.list.noItemsText = "No cars found";
    await this.carService.removeCar(car._id).toPromise();
  }

  onScroll() {
    this.filter.skip += 10;
    this.loadCars(true);
  }

  search(e) {
    this.searchWord = e;
    this.filter.skip = 0;
    this.loadCars();
  }

}

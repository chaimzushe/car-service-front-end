import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { ICar, subNavInfo } from 'src/app/models/car.model';
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
    backLink: '/home'
  }

  constructor(private carService: CarService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }
  ngOnDestroy(): void {
    this.subs.forEach(s=> s.unsubscribe())
  }
  cars: ICar[] = [];
  noItemsText = "No cars found";

  async ngOnInit() {
    this.cars = await this.carService.getAllCars(null).toPromise() as ICar[];
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

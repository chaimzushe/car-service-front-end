import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { subNavInfo } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent implements OnInit, OnDestroy {
  carId: any;
  carEditing: {};
  subscription: any = [];
  form: any;
  triedSubmitting: any;
  isSubmitting: any;
  subNavInfo: subNavInfo = {
    actionText: '',
    actionLink: [],
    backLink: '/cars'
  }
  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router

  ) { }

  ngOnInit(): void {

    let routeSubscription = this.route.params.subscribe(async params => {
      this.carId = params.id !== 'new' && params.id;

      if (this.carId) {
        this.carEditing = await this.carService.getCarDetail(this.carId).toPromise();
      } else {
        this.carEditing = {};
      }
      this.setupForm(this.carEditing);
    });
    this.subscription.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }

  setupForm(car) {
    this.form = this.fb.group({
      vin: [car.vin, [Validators.required]],
      model: [car.model , [Validators.required] ],
      carNumber: [car.car_id, Validators.required],
      color: [car.color, Validators.required],
      year: [car.year, Validators.required],
      driver: [car.driver],
    });
  }

  invalidInput(val) {
    return (this.form.get(val).touched || this.triedSubmitting) && (this.form.get(val).invalid);
  }

  async submit() {
    if (this.isSubmitting) { return; };
    this.isSubmitting = true;
    if (!this.form.valid) {
      this.snackbar.open("Please fix errors in the form", "Dismiss", { duration: 3000, panelClass: 'err-panel' })
      return this.isSubmitting = false;
    }
    if (this.carId) {
      try {
        let car = await this.carService.editCar(this.form.value, this.carId).toPromise();
        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    } else {
      try {
        let newCar = await this.carService.addCar(this.form.value).toPromise();


        return this.afterSaveAction();
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 1000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    }

  }
  afterSaveAction() {
    let sb = this.snackbar.open("Car successfully saved", "Dismiss", { duration: 1000 });
    sb.afterDismissed().subscribe(x => {
      this.isSubmitting = false;
      this.router.navigate(['/cars']);
    })
  }


}

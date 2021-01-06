import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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
      miles: [car.miles || 0],
      carNumber: [car.carNumber, Validators.required]
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
      this.carService.editCar(this.form.value)
    } else {
      try {
        let newCar = await this.carService.addCar(this.form.value).toPromise();
        this.isSubmitting = false;
        console.log(newCar);
        let sb = this.snackbar.open("Car successfully added", "Dismiss", { duration: 3000 });
        sb.afterDismissed().subscribe(x => {
          this.router.navigate(['/cars']);
        })
      } catch (e) {
        let sb = this.snackbar.open("Error saving", "Dismiss", { duration: 3000, panelClass: 'err-panel' });
        this.isSubmitting = false;
      }
    }

  }


}

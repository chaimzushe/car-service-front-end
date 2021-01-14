import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { subNavInfo } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { RepairService } from 'src/app/services/repair.service';
import { UserService } from 'src/app/services/user.service';

import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import { pipe } from 'rxjs';
import { Router } from '@angular/router';

interface IRepair {
  name: String;
  qty: Number;
  note?: String;
  isEditing?: boolean;
}
@Component({
  selector: 'app-receive-car',
  templateUrl: './receive-car.component.html',
  styleUrls: ['./receive-car.component.scss'],
})
export class ReceiveCarComponent implements OnInit {
  subNavInfo: subNavInfo = {
    actionText: '',
    actionLink: [],
    backLink: '/services',
  };
  allCars = [];
  allRepairs = [];
  selectedCar = null;
  repairsNeeded: IRepair[] = [];
  selectedRepair = null;
  filteredCars = [];
  filteredRepairs = [];
  users = [];
  filteredUsers: any;
  selectedMechanic = null;
  carGroupControl: FormGroup;
  mechanicFormGroup: FormGroup;
  repairListFormGroup: FormGroup;
  visitTypes = ['Maintenance', 'Accident', 'Inspection', 'TLC Other', 'Scheduled']
  loading = true;
  constructor(
    private carService: CarService,
    private repairService: RepairService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }




  hasItemValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const valid = !!this.repairsNeeded.length;
    console.table(this.repairsNeeded)
    return valid ? null : { invalid: { valid: false, value: control.value } };
  };

  get selectedCarNumber() {
    return this.carGroupControl && this.carGroupControl.value.carNumber
      ? '#' + (this.carGroupControl.value.carNumber.car_id || '--')
      : '';
  }

  get selectedUser() {
    return this.mechanicFormGroup && this.mechanicFormGroup.value.mechanic
      ? this.mechanicFormGroup.value.mechanic.name
      : '';
  }

  async ngOnInit() {

    this.filteredRepairs = this.allRepairs = (await this.repairService
      .getAllRepairs()
      .toPromise()) as [];
    this.users = this.filteredUsers = (await this.userService
      .getAllUsers()
      .toPromise()) as [];
    this.setupForms();
    this.loading = false;
  }

  setupForms() {
    this.carGroupControl = this.fb.group({
      carNumber: [null, Validators.required],
      miles: ['', Validators.required],
      visitType: ['', Validators.required]
    });
    this.mechanicFormGroup = this.fb.group({
      mechanic: ['', Validators.required],
    });
    this.repairListFormGroup = this.fb.group({
      selectedFirstRepair: [null],
      note: [''],
      price: [0]
    });
    let searchWord;
    this.carGroupControl.controls['carNumber'].valueChanges.pipe(
      debounceTime(200),
      map((e: any) => {
        searchWord = e;
        return e;
      }),
      distinctUntilChanged(),
      switchMap(_ => this.filterCars(searchWord))
    )
      .subscribe((res: []) => {
        this.filteredCars = res;
      });
      this.loading = false;
  }

  editNote(repair: IRepair, i) {
    repair.isEditing = !repair.isEditing;
  }

  carDisplayFunc(event) {
    return (event && event.car_id) || '';
  }

  userDisplayFunc(event) {
    return (event && event.name) || '';
  }

  filterCars(value) {
    console.log(value)
    return this.carService.getCarTypeAhead(value)
  }

  filterUsers(e) {
    this.filteredUsers = this.users.filter((c) =>
      c.name.toLowerCase().includes(e.currentTarget.value.toLowerCase())
    );
  }

  filterRepairs(e) {
    this.filteredRepairs = this.allRepairs.filter((c) => {
      return (
        c.name.toLowerCase().includes(e.currentTarget.value.toLowerCase()) &&
        !this.alreadySelected(c)
      );
    });
  }

  addCar(event) {
    this.snackbar.open('Calculating tasks needed for this car', 'Dismiss', {
      duration: 3000,
    });
  }

  addUser(event) {
    this.snackbar.open('Calculating tasks needed for this car', 'Dismiss', {
      duration: 3000,
    });
  }

  addRepair(event) {
    setTimeout((x) => {
      this.selectedRepair = null;
      this.filteredRepairs = this.allRepairs.filter(
        (c) => !this.alreadySelected(c)
      );
    }, 100);
    this.repairListFormGroup.patchValue({ selectedFirstRepair: null });
    this.repairsNeeded.push({ name: event.option.value, qty: 1 });
  }

  removeRepair(i) {
    this.repairsNeeded.splice(i, 1);
    this.filteredRepairs = this.allRepairs.filter(
      (c) => !this.alreadySelected(c)
    );
  }

  alreadySelected(r) {
    return this.repairsNeeded.find((rep) => rep.name === r.name);
  }
  getRepairId(repair) {
    let curRepair = this.allRepairs.find(r => r.name === repair.name);
    return curRepair._id;
  }
  createLabel() {
    const repairs = this.repairsNeeded.map(r => ({
      qty: r.qty,
      note: r.note,
      completed: false,
      repair: this.getRepairId(r)
    }));

    const newCarService = {
      mechanic: this.mechanicFormGroup.value.mechanic._id,
      mechanicName:this.mechanicFormGroup.value.mechanic.name,
      carNumber:this.carGroupControl.value.carNumber.car_id,
      car: this.carGroupControl.value.carNumber._id,
      milesAtService: this.carGroupControl.value.miles,
      note: this.repairListFormGroup.value.note,
      visitType: this.carGroupControl.value.visitType,
      priceOfOtherWork: this.repairListFormGroup.value.price,
      repairs,
    }
    this.carService.createService(newCarService).subscribe(x => {
      this.snackbar.open("Success", "Dismiss", { duration: 3000 });
      this.router.navigate(['/services'])
    });
  }
}

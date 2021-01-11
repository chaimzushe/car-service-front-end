import { Repair } from './../../models/car.model';
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

interface IRepair {
  name: String;
  qty: Number;
  note?: String;
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
    backLink: '/',
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

  constructor(
    private carService: CarService,
    private repairService: RepairService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  hasItemValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const valid = !!this.repairsNeeded.length;
    return valid ? null : { invalid: { valid: false, value: control.value } };
  };

  get selectedCarNumber() {
    return this.carGroupControl && this.carGroupControl.value.carNumber
      ? '#' + this.carGroupControl.value.carNumber.carNumber
      : '';
  }

  get selectedUser() {
    return this.mechanicFormGroup && this.mechanicFormGroup.value.mechanic
      ? this.mechanicFormGroup.value.mechanic.name
      : '';
  }

  async ngOnInit() {
    this.filteredCars = this.allCars = (await this.carService
      .getAllCars()
      .toPromise()) as [];
    this.filteredRepairs = this.allRepairs = (await this.repairService
      .getAllRepairs()
      .toPromise()) as [];
    this.users = this.filteredUsers = (await this.userService
      .getAllUsers()
      .toPromise()) as [];
    this.setupForms();
  }

  setupForms() {
    this.carGroupControl = this.fb.group({
      carNumber: [null, Validators.required],
      miles: ['', Validators.required],
    });
    this.mechanicFormGroup = this.fb.group({
      mechanic: ['', Validators.required],
    });
    this.repairListFormGroup = this.fb.group({
      selectedFirstRepair: [null, [this.hasItemValidator]],
      note: [[]],
    });
  }

  editNote(repair, i) {
    repair.note = 'Note added';
  }

  carDisplayFunc(event) {
    return (event && event.carNumber) || '';
  }

  userDisplayFunc(event) {
    return (event && event.name) || '';
  }

  filterCars(e) {
    console.table(this.allCars);
    this.filteredCars = this.allCars.filter((c) =>
      String(c.carNumber).includes(e.currentTarget.value.toLowerCase())
    );
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

  createLabel() {
    return this.snackbar.open(
      'Work in progress. Thank you for your patience 😊 ',
      'dismiss',
      { duration: 3000, panelClass: 'err-panel' }
    );
  }
}

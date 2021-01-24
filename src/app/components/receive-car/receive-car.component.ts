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
import { ActivatedRoute, Router } from '@angular/router';
import { CarServiceService } from 'src/app/services/car-service.service';

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
  serviceId: any;
  serviceObj: any = {};
  LoadingText = "Loading...";
  constructor(
    private carService: CarService,
    private repairService: RepairService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private carServiceService: CarServiceService,
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
    this.route.params.subscribe(async p => {
      if (p.id !== 'new') {
        this.serviceId = p.id;
        this.serviceObj = await this.carServiceService.getServiceDetail(p.id).toPromise();
        this.repairsNeeded = this.serviceObj.repairs.map(r => ({
          qty: r.qty,
          name: (r.repair && r.repair.name),
          note: r.note
        }));

      }
      this.filteredRepairs = this.allRepairs = (await this.repairService
        .getAllRepairs()
        .toPromise()) as [];
      this.users = this.filteredUsers = (await this.userService
        .getAllUsers('Mechanic')
        .toPromise()) as [];
      this.setupForms();
      this.loading = false;
    })
  }

  setupForms() {
    this.carGroupControl = this.fb.group({
      carNumber: [this.serviceObj.car, Validators.required],
      miles: [this.serviceObj.milesAtService, Validators.required],
      visitType: [this.serviceObj.visitType, Validators.required]
    });
    this.mechanicFormGroup = this.fb.group({
      mechanic: [this.serviceObj.mechanic],
    });
    this.repairListFormGroup = this.fb.group({
      selectedFirstRepair: [null],
      note: [this.serviceObj.note],
      price: [this.serviceObj.priceOfOtherWork || 0]
    });
    let searchWord;
    if (this.serviceId) {
      this.carGroupControl.controls['carNumber'].disable();
    } else {
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
    }
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

  async addCar() {
    if (this.serviceId || !this.carGroupControl.valid) return;
    this.loading = true;
    this.LoadingText = "Calculating repairs to add";

    let currentMiles = this.carGroupControl.value.miles;
    let carId = this.carGroupControl.value.carNumber.car_id;
    let visitType = this.carGroupControl.value.visitType;
    let allServices = await this.carServiceService.applyFilters({}, carId).toPromise();
    this.allRepairs.forEach(r => this.checkIfAutoAddRepair(r, allServices, currentMiles, visitType))
    this.loading = false;
    this.LoadingText = "";
  }

  stripNonNumbers(input) {
    return Number(String(input).replace(/\D/g, ''));
  }

  clearCurRepairs() {
    this.repairsNeeded = [];
  }

  checkIfAutoAddRepair(r, allServices, currentMiles, visitType) {
    if(this.repairsNeeded.find( rep => rep.name === r.name)) return;
    if (r.forVisit === visitType) {
      let msg = `System added because ${visitType} visits recommended this service`;

      this.repairsNeeded.push({ name: r.name, qty: 1, note: msg })
      return
    }
    let passedMilesCheck = r.checkWhenMilageIsAt == 0;
    let passedDateLapsCheck = r.intervalCheck == 0;
    let milesToStpCheckAt = this.stripNonNumbers(currentMiles) - this.stripNonNumbers(r.checkWhenMilageIsAt);
    let i = 0;

    if (!passedMilesCheck) {
      while (allServices[i] && this.stripNonNumbers(allServices[i].milesAtService) >= milesToStpCheckAt) {
        let hasRep = allServices[i].repairs.find(curRep => (curRep.repair && curRep.repair.name) === r.name && curRep.qty > 0);
        if (hasRep) {
          passedMilesCheck = true;
          // repair was done already
          break;
        }
        i++;
      }
    }
    // only check for dat lapse if passed checked for miles
    if (passedMilesCheck && !passedDateLapsCheck) {
      var today = new Date()
      var checkUntilDate = new Date().setDate(today.getDate() - r.intervalCheck)
      let i = 0;
      while (allServices[i] && new Date(allServices[i].serviceTime) >= new Date(checkUntilDate)) {
        if (allServices[i].repairs.find(curRep => (curRep.repair && curRep.repair.name) === r.name && curRep.qty > 0)) {
          passedDateLapsCheck = true;
          // repair was done already
          break;
        }
        i++;
      }
    }

    if (!passedMilesCheck || !passedDateLapsCheck) {
      let msg;
      if (!passedMilesCheck) {
        msg = `Added due to ${this.stripNonNumbers(r.checkWhenMilageIsAt)} miles added since last check`
      } else {
        msg = `Added due to ${r.intervalCheck} days passed since last check`
      }
      this.repairsNeeded.push({ name: r.name, qty: 1, note: msg })
    }

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
    let { mechanic } = this.mechanicFormGroup.value;
    const newCarService = {
      mechanic: (mechanic && mechanic._id || null),
      mechanicName: (mechanic && mechanic.name || null),
      carNumber: (this.carGroupControl.value.carNumber && this.carGroupControl.value.carNumber.car_id),
      car: (this.carGroupControl.value.carNumber && this.carGroupControl.value.carNumber._id),
      milesAtService: this.carGroupControl.value.miles,
      note: this.repairListFormGroup.value.note,
      visitType: this.carGroupControl.value.visitType,
      priceOfOtherWork: this.repairListFormGroup.value.price,
      repairs,
    }
    if (this.serviceId) {
      return this.updateService(newCarService)
    }
    this.loading = true;
    this.LoadingText = "Generating pdf file";
    this.carService.createService(newCarService).subscribe(x => {
      var blob = new Blob([x], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
      this.snackbar.open("Success", "Dismiss", { duration: 3000 });
      this.router.navigate(['/services'])
      this.loading = false;
      this.LoadingText = "";
    }, err => {
      this.loading = false;
    });
  }
  updateService(newCarService) {
    this.loading = true;
    this.LoadingText = "Updating service info";
    this.carServiceService.editUService(newCarService, this.serviceId).subscribe(x => {
      this.snackbar.open("Success", "Dismiss", { duration: 3000 });
      this.router.navigate(['/services'])
    });
  }
}

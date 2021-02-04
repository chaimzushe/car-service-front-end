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
import { DatePipe } from '@angular/common';

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
  allServices: any[] = [];
  currentBays: { name: string; value: number; inUse: boolean; }[];
  completed = false;
  constructor(
    private carService: CarService,
    private repairService: RepairService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private carServiceService: CarServiceService,
    private router: Router
  ) {
    this.currentBays = carServiceService.currentBays;
  }




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
      bayNumber: [this.serviceObj.bayNumber],
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
    let allServices = this.allServices || await this.carServiceService.applyFilters({}, carId).toPromise();
    this.allRepairs.forEach(r => this.checkIfAutoAddRepair(r, allServices, currentMiles, visitType))
    this.loading = false;
    this.LoadingText = "";
  }

  stripNonNumbers(input) {
    return Number(String(input).replace(/\D/g, ''));
  }

  async clearCurRepairs(e) {
    this.repairsNeeded = [];
   let carId = e.option.value.car_id;
   this.loading = true;
    this.allServices = await this.carServiceService.applyFilters({}, carId).toPromise() as any[];
    this.loading = false;
    let curMiles =  this.carGroupControl.value.miles;
    let lastMiles = this.stripNonNumbers( (this.allServices[0] && this.allServices[0].milesAtService));
    if(!curMiles || lastMiles >  curMiles){
      this.carGroupControl.patchValue({
        miles: lastMiles
      });
    }

  }

  repairDone(service, repair) {
    return service.repairs.find(curRep => (curRep.repair && curRep.repair.name) === repair.name && curRep.qty > 0);
  }

  getLastTimeRepDone(r, services) {
    return services.find(s => this.repairDone(s, r));
  }

  neverAutoAddRep(r) {
    let hasNoMileCheck = !r.checkWhenMilageIsAt || r.checkWhenMilageIsAt == 0;
    let hasNoDateCheck = !r.intervalCheck || r.intervalCheck == 0;
    let hasNoChecksFor = hasNoMileCheck && hasNoDateCheck && !r.forVisit
    return !r.active ||  hasNoChecksFor;
  }

  autoAdRepair(r, note) {
    this.repairsNeeded.push({ name: r.name, qty: 1, note })
  }

  getTimeDiff(service) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date() as any
    const then = new Date(service.serviceTime);
    const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utc2 = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
  }

  checkIfAutoAddRepair(r, allServices, currentMiles, visitType) {
    if (this.alreadySelected(r) || this.neverAutoAddRep(r)) return;
    if (r.forVisit === visitType) {
      return this.autoAdRepair(r, `System added because visit reason is ${visitType}`);
    }
    const lastTimeRepairDone = this.getLastTimeRepDone(r, allServices)  || {milesAtService: 0, serviceTime: new Date('1700, 1, ,1')};
    let milesTravelledSinceRepair = this.stripNonNumbers(currentMiles) - this.stripNonNumbers(lastTimeRepairDone.milesAtService);
    if (r.checkWhenMilageIsAt && r.checkWhenMilageIsAt != 0 && milesTravelledSinceRepair >= this.stripNonNumbers(r.checkWhenMilageIsAt)) {
      let msg = `LTS on ${this.datePipe.transform(new Date(lastTimeRepairDone.serviceTime), 'shortDate')}. Car was at ${this.stripNonNumbers(lastTimeRepairDone.milesAtService)} miles. Check when passing ${r.checkWhenMilageIsAt} miles`;
      if(lastTimeRepairDone.milesAtService ==0){
        msg = `Never done this repair to car. Recommended to check when passing ${r.checkWhenMilageIsAt}`;
      }
      return this.autoAdRepair(r, msg);
    }
    const daysSinceLatVisit = this.getTimeDiff(lastTimeRepairDone);
    if (r.intervalCheck && r.intervalCheck != 0 && daysSinceLatVisit >= this.stripNonNumbers(r.intervalCheck)) {
      let msg = `LTS on ${this.datePipe.transform(new Date(lastTimeRepairDone.serviceTime), 'shortDate')}. Recommended to check every ${r.intervalCheck} days`;
      if(daysSinceLatVisit > 5000) {
        msg = `Never done before. Recommended to check every ${r.intervalCheck} days`;
      }
      return this.autoAdRepair(r, msg);
    }

  }
  selectionsChanged(e) {
    if (e.previouslySelectedIndex === 0 && e.selectedIndex === 1) {
      this.addCar();
    } else if(e.previouslySelectedIndex === 1 && e.selectedIndex === 2){
      this.completed = true;
    }
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
      status: 'IN QUEUE',
      repairs,
      bayNumber: (this.mechanicFormGroup.value.bayNumber),
    }
    if(newCarService.bayNumber){
      newCarService.status = "IN PROGRESS";
    }

    if (this.serviceId) {
      return this.updateService(newCarService)
    }
    this.loading = true;
    this.LoadingText = "Saving";
    this.carService.createService(newCarService).subscribe(x => {
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

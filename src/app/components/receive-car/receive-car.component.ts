import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { subNavInfo } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { RepairService } from 'src/app/services/repair.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-receive-car',
  templateUrl: './receive-car.component.html',
  styleUrls: ['./receive-car.component.scss']
})
export class ReceiveCarComponent implements OnInit {
  subNavInfo: subNavInfo = {
    actionText: '',
    actionLink: [],
    backLink: '/'
  }
  allCars = [];
  allRepairs = [];
  selectedCar = null;
  selectedRepair = null;
  filteredCars = [];
  repairsNeeded = [];
  filteredRepairs = [];
  users = [];
  filteredUsers: any;
  selectedMechanic = null;
  constructor(private carService: CarService, private repairService: RepairService, private snackbar: MatSnackBar, private userService: UserService) { }

  async ngOnInit() {
    this.filteredCars = this.allCars = await this.carService.getAllCars().toPromise() as [];
    this.filteredRepairs = this.allRepairs = await this.repairService.getAllRepairs().toPromise() as [];
    this.users = this.filteredUsers = await this.userService.getAllUsers().toPromise() as [];
  }

  filterCars(e) {
    this.filteredCars = this.allCars.filter(c => c.name.includes(e.currentTarget.value));
  }

  filterUsers(e) {
    this.filteredUsers = this.users.filter(c => String(c.carNumber).includes(e.currentTarget.value));
  }

  filterRepairs(e) {
    this.filteredRepairs = this.allRepairs.filter(c => {
      return c.name.includes(e.currentTarget.value) && !this.alreadySelected(c);
    });
  }

  addRepair(event) {
    setTimeout(x => {
      this.selectedRepair = null;
      this.filteredRepairs = this.allRepairs.filter(c => !this.alreadySelected(c));
    }, 100)

    this.repairsNeeded.push({ name: event.option.value, qty: 1 })
    const input = document.querySelector('.repair-input') as HTMLInputElement;
    input.blur();
  }

  removeRepair(i) {
    this.repairsNeeded.splice(i, 1);
    this.filteredRepairs = this.allRepairs.filter(c => !this.alreadySelected(c));
  }


  alreadySelected(r) {
    return this.repairsNeeded.find(rep => rep.name === r.name);
  }

  createLabel() {
    return this.snackbar.open("Work in progress. Thank you for your patience 😊 ", "dismiss", { duration: 3000, panelClass: "err-panel" })
  }

}

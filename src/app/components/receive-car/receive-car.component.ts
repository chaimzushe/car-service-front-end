import { Component, OnInit } from '@angular/core';
import { subNavInfo } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { RepairService } from 'src/app/services/repair.service';

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
  filteredCars = [];
  constructor(private carService: CarService, private repairService: RepairService) { }

  async ngOnInit() {
    this.filteredCars = this.allCars = await this.carService.getAllCars().toPromise() as [];
    this.allRepairs = await this.repairService.getAllRepairs().toPromise() as [];
  }

  filterCars(e){
    this.filteredCars = this.allCars.filter( c => String(c.carNumber).includes(e.currentTarget.value));
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Service, subNavInfo } from 'src/app/models/car.model';
import { CarServiceService } from 'src/app/services/car-service.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-car-services-list',
  templateUrl: './car-services-list.component.html',
  styleUrls: ['./car-services-list.component.scss']
})
export class CarServicesListComponent implements OnInit {
  subNavInfo: subNavInfo = {
    actionText: 'Receive Car',
    actionLink: ['new'],
    backLink: '/home'
  }
  services: Service[] = [];
  constructor(private carServiceService: CarServiceService ,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.services = await this.carServiceService.getAllServices().toPromise() as Service[];

  }

  getFields(service: Service){
    return [
      {name: 'Miles', value: service.milesAtService},
      {name: 'Status', value: service.status},
      {name: 'Created', value: this.datePipe.transform(service.createdAt,'short')},
      {name: 'Updated', value: this.datePipe.transform(service.updatedAt,'short')},
    ]
  }

}

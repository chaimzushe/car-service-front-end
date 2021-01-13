import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Service, subNavInfo } from 'src/app/models/car.model';
import { CarServiceService } from 'src/app/services/car-service.service';
import { DatePipe } from '@angular/common';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-car-services-list',
  templateUrl: './car-services-list.component.html',
  styleUrls: ['./car-services-list.component.scss']
})
export class CarServicesListComponent implements OnInit, OnDestroy {
  subNavInfo: subNavInfo = {
    actionText: 'Receive Car',
    actionLink: ['new'],
    backLink: '/home'
  }
  services: Service[] = [];
  subs: Subscription [] = [];
  constructor(private carServiceService: CarServiceService ,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.services = await this.carServiceService.getAllServices().toPromise() as Service[];

  }

  ngOnDestroy(){
    this.subs.forEach(s => s.unsubscribe());
  }

  getFields(service: Service){
    return [
      {name: 'Miles', value: service.milesAtService},
      {name: 'Status', value: service.status},
      {name: 'Visit type', value: service.visitType},
      {name: 'Created', value: this.datePipe.transform(service.createdAt,'short')},
      {name: 'Updated', value: this.datePipe.transform(service.updatedAt,'short')},
    ]
  }

  toggleExpand(service: Service){
    service.expanded = !service.expanded
  }

  deleteService(service, i){
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this service?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.services.splice(i, 1);
      let removeSub = this.carServiceService.removeService(service._id).subscribe(x => {
      //alert();
      });
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

}

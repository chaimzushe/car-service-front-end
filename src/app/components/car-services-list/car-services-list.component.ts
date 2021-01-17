import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Service, subNavInfo, User } from 'src/app/models/car.model';
import { CarServiceService } from 'src/app/services/car-service.service';
import { DatePipe } from '@angular/common';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { Subscription } from 'rxjs';
import { ServicesFilterComponent } from 'src/app/dialogs/services-filter/services-filter.component';
import { UserService } from 'src/app/services/user.service';
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
  subs: Subscription[] = [];
  users: any[] = [];
  searchWord: any;
  filter: any = { limit: 10, skip: 0 };
  links = [
    { name: '', active: true },
    { name: 'IN PROGRESS', active: false },
    { name: 'COMPLETED', active: false },
    { name: 'APPROVED', active: false },
  ];
  constructor(private carServiceService: CarServiceService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.services = await this.carServiceService.applyFilters(this.filter, this.searchWord).toPromise() as Service[];
    this.users = await this.userService.getAllUsers().toPromise() as [];
    this.users = this.users.map(u => u.name);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  setActive(link, idx) {
    this.links.forEach((l, i) => l.active = i === idx);
    this.filter.status = link.name;
    this.filter.skip = 0;
    this.carServiceService.applyFilters(this.filter, this.searchWord).subscribe((f: any) => {
      this.services = f;
    });
  }

  getFields(service: Service) {
    return [
      { name: 'Miles', value: service.milesAtService },
      { name: 'Status', value: service.status },
      { name: 'Visit type', value: service.visitType },
      { name: 'Serviced', value: this.datePipe.transform(service.serviceTime, 'short') },
      { name: 'Updated', value: this.datePipe.transform(service.updatedAt, 'short') },
    ]
  }

  async onScroll() {
    this.filter.skip += 10;
    const mewServices = await this.carServiceService.applyFilters(this.filter, this.searchWord).toPromise() as Service[];
    this.services.push(...mewServices);
  }

  toggleExpand(service: Service) {
    service.expanded = !service.expanded
  }

  deleteService(service, i) {
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

  search(e) {
    this.searchWord = e;
    this.filter.skip = 0;
    this.carServiceService.applyFilters(this.filter, this.searchWord).subscribe((f: any) => {
      this.services = f;
    });
  }

  editService(service, i) {
    this.router.navigate([service._id], { relativeTo: this.route })
  }

  openFilter() {

    let dialogRef = this.dialog.open(ServicesFilterComponent, {
      width: "400px",
      autoFocus: false,
      data: { mechanics: this.users }
    });

    dialogRef.afterClosed().subscribe(filter => {
      if (!filter) {
        return;
      }
      this.filter = { ...this.filter, ...filter, skip: 0 };
      this.carServiceService.applyFilters(this.filter, this.searchWord).subscribe((f: any) => {
        this.services = f;
      });
    });
  }


}

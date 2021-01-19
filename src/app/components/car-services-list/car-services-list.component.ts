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
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-car-services-list',
  templateUrl: './car-services-list.component.html',
  styleUrls: ['./car-services-list.component.scss']
})

export class CarServicesListComponent implements OnInit, OnDestroy {
  subNavInfo: subNavInfo = {
    actionText: 'Receive Car',
    actionLink: ['new'],
    backLink: '/home',
    sync: true
  }
  services: Service[] = [];
  subs: Subscription[] = [];
  users: any[] = [];
  searchWord: any;
  noItemText = 'Loading...';
  filter: any = { limit: 10, skip: 0 };
  links = [
    { name: '', active: true },
    { name: 'IN PROGRESS', active: false },
    { name: 'COMPLETED', active: false },
    { name: 'APPROVED', active: false },
  ];

  get currentFilters(){
    return Object.keys(this.filter).filter( k => {
      return !['status', 'skip', 'limit', 'searchWord'].includes(k) && this.filter[k]
    });
  }
  constructor(private carServiceService: CarServiceService,
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.getList();
    this.users = await this.userService.getAllUsers().toPromise() as [];
    this.users = this.users.map(u => u.name);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  sync(){
    return this.snackbar.open("sync with google sheets in progress", "dismiss", { duration: 3000, panelClass: "err-panel" })
  }

  setActive(link, idx) {
    this.links.forEach((l, i) => l.active = i === idx);
    this.filter.status = link.name;
    this.filter.skip = 0;
   this.getList();
  }

  getPrice(service){
    return 20;
  }
  stripNonNumbers(input) {
    return Number(String(input).replace(/[^0-9.,]/g, ""));
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

  removeFilter(f){
    this.filter[f] = null;
    this.getList();
  }

  getTotalPrice(s){
    let sum = 0
    s.repairs.forEach(r => {
      sum += r.qty * r.repair.price;
    });
    sum += this.stripNonNumbers(s.priceOfOtherWork);
    return sum;
  }

  async onScroll() {
    this.filter.skip += 10;
    const mewServices = await this.carServiceService.applyFilters(this.filter, this.searchWord).toPromise() as Service[];
    mewServices.forEach( s => s.totalPrice = this.getTotalPrice(s))
    this.services.push(...mewServices);
  }

  async toggleApprove(service){
    let newStatus = service.status === "APPROVED" ? 'COMPLETED' : 'APPROVED';
    service.status = newStatus;
    await this.carServiceService.editUServiceStatus(newStatus, service._id).toPromise();
    this.snackbar.open("Updated successfully", "dismiss", { duration: 3000 })
  }

  toggleExpand(service: Service) {
    service.expanded = !service.expanded
  }

  getList(){
   let sub = this.carServiceService.applyFilters(this.filter, this.searchWord).subscribe((f: any) => {
      this.services = f;
      this.services.forEach( s => s.totalPrice = this.getTotalPrice(s) )
      if(f.length === 0) this.noItemText = "No services found";
    });
    this.subs.push(sub)
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
    this.getList();
  }

  editService(service, i) {
    this.router.navigate([service._id], { relativeTo: this.route })
  }

  openFilter() {

    let  dialogRef = this.dialog.open(ServicesFilterComponent, {
      width: "400px",
      autoFocus: false,
      data: { mechanics: this.users }
    });

    let closedSub = dialogRef.afterClosed().subscribe(filter => {
      if (!filter) {
        return;
      }
      this.filter = { ...this.filter, ...filter, skip: 0 };
      this.getList();
    });
    this.subs.push(closedSub);
  }

  goToHistory(service){
    this.router.navigate(['history',service.carNumber], {relativeTo: this.route})
  }


}

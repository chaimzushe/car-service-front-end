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
import { GoogleSpreadsheetWarnComponent } from 'src/app/dialogs/google-spreadsheet-warn/google-spreadsheet-warn.component';
import { AssignToBayComponent } from 'src/app/dialogs/assign-to-bay/assign-to-bay.component';

@Component({
  selector: 'app-car-services-list',
  templateUrl: './car-services-list.component.html',
  styleUrls: ['./car-services-list.component.scss']
})

export class CarServicesListComponent implements OnInit, OnDestroy {
  getAuthToken() {
    const idToken = localStorage.getItem('id_token');
    return ('Bearer ' + idToken);
  }
  subNavInfo: subNavInfo = {
    actionText: 'Receive Car',
    actionLink: ['new'],
    backLink: '/home',
    sync: true
  }
  visitTypesColor = {};
  services: Service[] = [];
  loading = true;
  subs: Subscription[] = [];
  users: any[] = [];
  searchWord: any;
  noItemText = 'Loading...';
  filter: any = { limit: 6, skip: 0, status: 'IN QUEUE' };
  authorizationToken = "";
  links = [
    { name: 'IN QUEUE', active: true },
    { name: 'IN PROGRESS', active: false },
    { name: 'COMPLETED', active: false },
    { name: 'APPROVED', active: false },
  ];
  actionMenu = [];
  isCollapsed = false;
  filterNameMap = {
    user: 'Mechanic',
    startDate: 'From Date',
    endDate: 'Till Date',
  }


  currentFilters = [];
  usedBays: any[] = [];

  constructor(private carServiceService: CarServiceService,
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog) {

    this.visitTypesColor = carServiceService.visitTypesColor;
  }

  async ngOnInit() {
    this.getList();
    this.users = (await this.userService.getAllUsers().toPromise() as any[]).map(u => u.name);
    this.getUsedBays()
    this.setupSocketIo()
  }
  setupSocketIo() {
    let sub = this.carServiceService.listen('bay-change').subscribe(x => {
      this.getUsedBays();
      if (this.filter.status === "IN QUEUE") {
        this.snackbar.open('Item IN QUEUE recently updated', 'Dismiss', { duration: 2000 });
        this.filter.skip = 0;
        this.getList();
      }
    });
    this.subs.push(sub);
  }
  bayUpdated(e) {
    console.log('Updated', { e });
  }
  async getUsedBays() {
    let inProgress = await this.carServiceService.applyFilters({ status: 'IN PROGRESS' }, '').toPromise() as any[];
    this.usedBays = inProgress.filter(s => s.bayNumber).map(s => s.bayNumber);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  sync() {
    return this.snackbar.open("sync with google sheets in progress", "dismiss", { duration: 3000, panelClass: "err-panel" })
  }

  toggleCollapseAll(event) {
    this.services.forEach(s => {
      s.expanded = !this.isCollapsed;
    })
  }

  setActive(link, idx) {
    this.links.forEach((l, i) => l.active = i === idx);
    this.filter.status = link.name;
    this.filter.skip = 0;
    this.getList();
  }

  setCurrentFilters() {
    this.currentFilters = Object.keys(this.filter).filter(k => {
      return !['status', 'skip', 'limit', 'searchWord'].includes(k) && this.filter[k]
    }).map(k => {
      let value = this.filter[k];
      if ((value instanceof Date)) value = this.datePipe.transform(new Date(value), 'longDate')
      return { name: this.filterNameMap[k], value, realName: k }
    });
  }

  getPrice(service) {
    return 20;
  }
  stripNonNumbers(input) {
    return Number(String(input).replace(/[^0-9.]/g, ""));
  }
  getFields(service) {
    let fields = [
      { name: 'Miles', value: service.milesAtService },
      { name: 'Status', value: service.status },
      { name: 'Serviced', value: this.datePipe.transform(service.serviceTime, 'short') },
      { name: 'Updated', value: this.datePipe.transform(service.updatedAt, 'short') },
    ]
    if (this.filter.status === "IN PROGRESS" && service.bayNumber) {
      fields.unshift({ name: 'Bay Number', value: service.bayNumber })
    }
    return fields;
  }

  removeFilter(f, i) {
    this.filter[f.realName] = null;
    this.getList();
  }

  getTotalPrice(s) {
    let sum = 0
    s.repairs.forEach(r => {
      if (!r.repair) return;
      sum += r.qty * r.repair.price;
    });
    sum += this.stripNonNumbers(s.priceOfOtherWork);
    return sum;
  }

  async onScroll() {
    this.filter.skip += 4;
    this.loading = true;
    const mewServices = await this.carServiceService.applyFilters(this.filter, this.searchWord).toPromise() as Service[];
    mewServices.forEach(s => {
      s.totalPrice = this.getTotalPrice(s);
      s.expanded = !this.isCollapsed;
    })
    this.services.push(...mewServices);
    this.loading = false;
  }

  async toggleApprove(status, service, index) {

    let newStatus = status;

    service.status = newStatus;
    try {
      await this.carServiceService.editUServiceStatus(newStatus, service._id).toPromise();
      if (newStatus === 'IN QUEUE' && service.bayNumber) {
        this.usedBays = this.usedBays.filter(b => b != service.bayNumber);
      }
      let newTabIndex = this.links.findIndex(l => l.name === newStatus);
      this.snackbar.open("Updated successfully", "dismiss", { duration: 3000 });
    } catch (err) {
      if (newStatus === "APPROVED") {
        let desc = "This work was not added to google spreadsheets. Please make sure add manually. An email has beed sent out to you to remind you";
        const data = { status: 'An Error Occurred', desc, icon: "fal fa-exclamation-circle" };
        this.openErrDialog(data)
      }
    }

  }

  openErrDialog(data: { status: string; desc: string; icon: string; }) {
    const dialog = this.dialog.open(GoogleSpreadsheetWarnComponent,
      {
        data,
        width: "500px"
      }
    )
    return dialog;
  }

  toggleExpand(service: Service) {
    service.expanded = !service.expanded
  }

  getList() {
    this.loading = true;
    let sub = this.carServiceService.applyFilters(this.filter, this.searchWord).subscribe((f: any) => {
      this.services = f;
      this.services.forEach(s => {
        s.totalPrice = this.getTotalPrice(s);
        s.expanded = !this.isCollapsed;
      })
      this.setCurrentFilters();
      this.loading = false;
      if (f.length === 0) this.noItemText = "No services found";
      else this.setUpActionMenu()

    });
    this.subs.push(sub)
  }
  assignToBay(service, i) {
    if (i !== 0) {
      return this.snackbar.open(`Only item on top of the list can be assigned to a bay`, "dismiss", { panelClass: 'err-panel', duration: 3000 });
    }
    let dialogRef = this.dialog.open(AssignToBayComponent, {
      width: "400px",
      autoFocus: false,
      data: { usedBays: this.usedBays }
    });

    let closedSub = dialogRef.afterClosed().subscribe(async bay => {
      if (!bay) {
        return;
      }
      await this.carServiceService.assignBay(bay, service._id).toPromise();
      this.snackbar.open(`Successfully added to bay number ${bay}`, "dismiss", { duration: 3000 });
      this.usedBays.push(bay);
      this.filter.skip = 0;
      this.getList();
    });
    this.subs.push(closedSub);
  }

  reOrder(e) {
    this.services.splice(e.currentIndex, 0, this.services.splice(e.previousIndex, 1)[0]);
  }

  setUpActionMenu() {
    this.actionMenu = [
      { name: 'Delete', icon: 'fal fa-trash-alt', actionFunction: this.deleteService.bind(this) }
    ]

    switch (this.filter.status) {
      case "IN QUEUE": {
        this.actionMenu.unshift(
          { name: 'Edit', icon: 'fal fa-edit', actionFunction: this.editService.bind(this) },
          { name: 'Assign To Bay', icon: 'fal fa-plug', actionFunction: this.assignToBay.bind(this) }
        )
        return;
      }

      case "IN PROGRESS": {
        this.actionMenu.unshift(
          { name: 'View Full History', icon: 'fal fa-history', actionFunction: this.goToHistory.bind(this) },
          { name: 'Download Maintenance PDF', icon: 'fal fa-file-pdf', actionFunction: this.downloadODF.bind(this) },
          { name: 'Edit', icon: 'fal fa-edit', actionFunction: this.editService.bind(this) },
          { name: 'Back to Queue', icon: 'fal fa-undo', actionFunction: this.toggleApprove.bind(this, 'IN QUEUE') },
          { name: 'Mark Completed', icon: 'fal fa-check-circle', actionFunction: this.toggleApprove.bind(this, 'COMPLETED') },
        )
        return;
      }
      case "COMPLETED": {
        this.actionMenu.unshift(
          { name: 'View Full History', icon: 'fal fa-history', actionFunction: this.goToHistory.bind(this) },
          { name: 'Edit', icon: 'fal fa-edit', actionFunction: this.editService.bind(this) },
          { name: 'Back to Queue', icon: 'fal fa-undo', actionFunction: this.toggleApprove.bind(this, 'IN QUEUE') },
          { name: 'Approve', icon: 'fal fa-thumbs-up', actionFunction: this.toggleApprove.bind(this, 'APPROVED') },
        )
        return;
      }

      case "APPROVED": {
        this.actionMenu.unshift(
          { name: 'View Full History', icon: 'fal fa-history', actionFunction: this.goToHistory.bind(this) },
          { name: 'Disapprove', icon: 'fal fa-thumbs-down', actionFunction: this.toggleApprove.bind(this, 'COMPLETED') },
        )
        return;
      }
    }
  }

  async downloadODF(service, i) {
    let data = await this.carServiceService.downloadPDF(service._id).toPromise() as any;
    var blob = new Blob([data], { type: 'application/pdf' });
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
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

    let dialogRef = this.dialog.open(ServicesFilterComponent, {
      width: "400px",
      autoFocus: false,
      data: { mechanics: this.users, filter: this.filter }
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

  goToHistory(service, i) {
    this.router.navigate(['history', service.carNumber], { relativeTo: this.route })
  }


}

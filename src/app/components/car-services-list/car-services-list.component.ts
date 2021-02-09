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
import { AuthService } from 'src/app/services/auth.service';
import { AddToWaitingComponent } from 'src/app/dialogs/add-to-waiting/add-to-waiting.component';

@Component({
  selector: 'app-car-services-list',
  templateUrl: './car-services-list.component.html',
  styleUrls: ['./car-services-list.component.scss']
})

export class CarServicesListComponent implements OnInit, OnDestroy {
  allWaitingServices: any;
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
  sortOptions = [
    { name: 'UPDATED TIME', value: 'updatedAt' },
    { name: 'IN TAKE TIME', value: 'serviceTime' },
    { name: 'MILES', value: 'milesAtService' }
  ]
  users: any[] = [];
  searchWord: any;
  noItemText = 'Loading...';
  filter: any = { limit: 6, skip: 0, status: 'IN QUEUE', sortBy: 'serviceTime', dir: -1 };
  listCount = 0;
  waitingFilter = [
    { name: 'All', active: true },
    { name: 'Needs Buggy Approval', active: false },
    { name: 'Missing Parts', active: false }
  ];

  authorizationToken = "";
  bays = []
  links: any[] = [
    { name: 'IN QUEUE', active: true },
    { name: 'IN PROGRESS', active: false },
    { name: 'COMPLETED', active: false },
    { name: 'APPROVED', active: false },
    { name: 'WAITING', active: false },
  ];
  user = {};
  actionMenu = [];
  isCollapsed = false;
  filterNameMap = {
    user: 'Mechanic',
    startDate: 'From Date',
    endDate: 'Till Date',
    visitType: 'Visit Reason',
  }


  currentFilters = [];
  usedBays: any[] = [];

  constructor(private carServiceService: CarServiceService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog) {
    this.bays = this.carServiceService.currentBays;
    this.visitTypesColor = carServiceService.visitTypesColor;
    let userSub = this.authService.userSubject.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.subs.push(userSub);
  }

  sortItems() {
    this.filter.skip = 0;
    this.getList();
  }

  setSortingDir() {
    this.filter.dir = this.filter.dir === -1 ? 1 : -1;
    this.filter.skip = 0;
    this.getList();
  }

  async ngOnInit() {
    this.getList();
    this.users = (await this.userService.getAllUsers().toPromise() as any[]).map(u => u.name);
    this.getUsedBays();
    this.setupSocketIo();
    this.route.queryParams.subscribe(qp => {
      if (qp.link) {
        let activeLinkIdx = this.links.findIndex(l => l.name === qp.link);
        this.setActive(this.links[activeLinkIdx], activeLinkIdx)
      }
    });
  }

  setWaitingFilterActive(r, i) {
    this.waitingFilter.forEach((f, idx) => {
      f.active = idx === i;
    });
    this.services = this.allWaitingServices.filter(s => {
      return r.name === 'All' || s.waitingInfo.reason === r.name;
    });
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
    let { allCarsIds: inProgress } = await this.carServiceService.applyFilters({ status: 'IN PROGRESS' }, '').toPromise() as any;
    this.usedBays = inProgress.filter(s => s.bayNumber).map(s => s.bayNumber);
    this.carServiceService.currentBays.forEach(bay => {
      bay.inUse = !!this.usedBays.find(b => b === bay.value);
    });
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
      return !['status', 'skip', 'limit', 'searchWord', 'dir', 'sortBy'].includes(k) && this.filter[k]
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
      { name: 'Serviced', value: this.datePipe.transform(service.serviceTime, 'short') },
      { name: 'Updated', value: this.datePipe.transform(service.updatedAt, 'short') },
    ]
    if (this.filter.status === "IN PROGRESS" && service.bayNumber) {
      fields.unshift({ name: 'Bay Number', value: service.bayNumber })
    }

    if (["COMPLETED", "APPROVED"].includes(service.status) && service.visitType) {
      fields.unshift({ name: 'Visit Reason', value: service.visitType })
    }

    if (["WAITING"].includes(service.status) && service.visitType) {
      fields = [
        { name: "Reason", value: service.waitingInfo.reason },
        { name: "Car Location", value: service.waitingInfo.location },
        { name: 'Updated', value: this.datePipe.transform(service.updatedAt, 'short') },
      ]
    }
    return fields;
  }

  showPrice(service) {
    return ["COMPLETED", "APPROVED"].includes(service.status)
  }

  showVisit(service) {
    return ["IN QUEUE", "IN PROGRESS"].includes(service.status)
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
    this.filter.skip += 6;
    this.loading = true;
    let { allCarsIds: mewServices } = await this.carServiceService.applyFilters(this.filter, this.searchWord).toPromise() as any;
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
      this.filter.take = 0;
      this.getList();
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
      if (this.filter.status === "WAITING") {
        this.allWaitingServices = f.allCarsIds;
      }
      this.services = f.allCarsIds;
      this.links.find(l => l.name === this.filter.status).itemCount = (f.count >= 99 ? '99+' : f.count);
      this.services.forEach(s => {
        s.totalPrice = this.getTotalPrice(s);
        s.expanded = !this.isCollapsed;
      })
      this.setCurrentFilters();
      this.loading = false;
      if (f.allCarsIds.length === 0) this.noItemText = "No services found";
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
      if (this.carServiceService.bayInUse(bay)) {
        const dialogRef = this.dialog.open(ConfirmActionComponent, {
          width: '250px',
          data: { msg: 'This bay is already in use. Do you want to assign another car to it?' },
          autoFocus: false
        });

        let result = await dialogRef.afterClosed().toPromise();
        console.log(result)
        if (!result) return;
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

  addToWaitingList(service, i) {
    let dialogRef = this.dialog.open(AddToWaitingComponent, {
      width: "400px",
      autoFocus: false,
      data: { info: service.waitingInfo }
    });

    let closedSub = dialogRef.afterClosed().subscribe(async res => {
      if (!res) {
        return;
      }
      let data = await this.carServiceService.waiting(res, service._id).toPromise();
      this.filter.skip = 0;
      this.getList();
      this.snackbar.open(`Successfully added to waiting area`, "dismiss", { duration: 3000 });
    });
    this.subs.push(closedSub);
  }

  setUpActionMenu() {
    this.actionMenu = [
      { name: 'Edit', icon: 'fal fa-edit', actionFunction: this.editService.bind(this) },
      { name: 'Delete', icon: 'fal fa-trash-alt', actionFunction: this.deleteService.bind(this) }
    ]

    switch (this.filter.status) {
      case "IN QUEUE": {
        this.actionMenu.unshift(
          { name: 'Add to waiting list', icon: 'fal fa-exclamation-triangle', actionFunction: this.addToWaitingList.bind(this) },
          { name: 'Download Maintenance PDF', icon: 'fal fa-file-pdf', actionFunction: this.downloadODF.bind(this) },
          { name: 'Assign To Bay', icon: 'fal fa-plug', actionFunction: this.assignToBay.bind(this) },

        )
        return;
      }

      case "IN PROGRESS": {
        this.actionMenu.unshift(
          { name: 'View Full History', icon: 'fal fa-history', actionFunction: this.goToHistory.bind(this) },
          { name: 'Download Maintenance PDF', icon: 'fal fa-file-pdf', actionFunction: this.downloadODF.bind(this) },
          { name: 'Back to Queue', icon: 'fal fa-undo', actionFunction: this.toggleApprove.bind(this, 'IN QUEUE') },
          { name: 'Mark Completed', icon: 'fal fa-check-circle', actionFunction: this.toggleApprove.bind(this, 'COMPLETED') },
          { name: 'Work Page', icon: 'fal fa-wrench', actionFunction: this.goToWorkPage.bind(this) },
          { name: 'Add to waiting list', icon: 'fal fa-exclamation-triangle', actionFunction: this.addToWaitingList.bind(this) },
        )
        return;
      }
      case "COMPLETED": {
        this.actionMenu.unshift(
          { name: 'View Full History', icon: 'fal fa-history', actionFunction: this.goToHistory.bind(this) },
          { name: 'Download Maintenance PDF', icon: 'fal fa-file-pdf', actionFunction: this.downloadODF.bind(this) },
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

      case "WAITING": {
        this.actionMenu.unshift(
          { name: 'Edit Waiting Info', icon: 'fal fa-exclamation-triangle', actionFunction: this.addToWaitingList.bind(this) },
          { name: 'Back To Progress', icon: 'fal fa-undo', actionFunction: this.toggleApprove.bind(this, 'IN PROGRESS') },
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

  goToWorkPage(service, i) {
    this.router.navigate(['work-page', service._id])
  }


}

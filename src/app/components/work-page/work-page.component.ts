import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddToWaitingComponent } from 'src/app/dialogs/add-to-waiting/add-to-waiting.component';
import { SelectItemComponent } from 'src/app/dialogs/select-item/select-item.component';
import { CarFullInfo, Service, subNavInfo } from 'src/app/models/car.model';
import { AuthService } from 'src/app/services/auth.service';
import { CarServiceService } from 'src/app/services/car-service.service';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})


export class WorkPageComponent implements OnInit, OnDestroy {
  subNavInfo: subNavInfo = {
    actionText: 'View Full History',
    backLink: '/services',
    hideFilter: true,
    hideSearch: true
  }
  loading = true;
  service: Service;
  subs: Subscription[] = [];
  confirm = false;
  car: any;
  user: any;
  filteredRepairs: any;
  allRepairs: any;
  addedRepairs: any = [];
  repairsToCheck: any;
  allServicesForCar: any;
  serviceInfo: any;
  constructor(
    private carServiceService: CarServiceService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private repairService: RepairService,
    private datePipe : DatePipe,
    private snackbar: MatSnackBar) {
    let userSub = this.authService.userSubject.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.subs.push(userSub);
  }

  async ngOnInit() {
    this.route.params.subscribe(async p => {
      this.service = await this.carServiceService.getServiceDetail(p.id).toPromise() as Service;
      this.car = this.InfoToCard(this.service.car, this.service);
      this.filteredRepairs = this.allRepairs = (await this.repairService.getAllRepairs().toPromise()) as [];
      this.repairsToCheck = this.allRepairs.filter(r => r.showLastPerformed);
     let { allCarsIds} = await this.carServiceService.applyFilters({}, this.service.carNumber).toPromise() as any;
     allCarsIds = allCarsIds.filter(s => s.status === "APPROVED");
      this.repairsToCheck.forEach(r => {
        r.lastDone = this.findLastToneDone(r, allCarsIds);
      });
      this.serviceInfo = this.ServiceToCard();
      console.table(this.repairsToCheck)
      this.loading = false;
    });

  }

  ServiceToCard(): any {
   return {
      header: `Last time repaired`,
      middles: this.repairsToCheck.map( r => {
        return  {
          key: r.name,
          value: (r.lastDone && this.datePipe.transform(new Date(r.lastDone), 'longDate') || 'Never')
        }}),
    }
  }

  findLastToneDone(rep, services: Service[]): any {
    let doneLast =   services.find( s => s.repairs.find(r => (r.repair && r.repair.name) === rep.name));
    return doneLast && doneLast.serviceTime
  }

  InfoToCard(c: CarFullInfo, s: Service): any {
    return {
      _id: c._id,
      header: `Car Number: ${c.car_id}`,
      middles: [
        { key: 'VIN', value: `${c.vin}` },
        { key: 'Model', value: `${c.model}` },
        { key: 'Year', value: `${c.year}` },
        { key: 'Color', value: `${c.color}` },
        { key: 'Last Miles', value: `${s.milesAtService}` }
      ],
      bottom: (c.driver),
      warn: (c.driver === "STAGE 13")
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }



  toggleNote(isEdit) {
    this.service.isEditing = isEdit;
    if (isEdit) {
      setTimeout( _ => {
        document.querySelector('textarea').focus()
       }, 200);
    }
  }

  getRepairId(repair) {
    let curRepair = this.allRepairs.find(r => r.name === repair.name);
    return curRepair._id;
  }

  async markCompete() {
    let newStatus = "COMPLETED";

    this.service.status = newStatus;
    try {
      this.loading = true;
      let newCarService = this.formatServiceForUpdate();
      await this.carServiceService.editUService(newCarService, this.service._id).toPromise();
      await this.carServiceService.editUServiceStatus("COMPLETED", this.service._id).toPromise();
      this.router.navigate(['/services'], { queryParams: { link: 'COMPLETED' } });
    } catch (err) {
      this.snackbar.open("An error . Please try again", "dismiss", { duration: 3000, panelClass: 'err-panel' });
      this.loading = false;
    }
  }

  formatServiceForUpdate() {
    const repairs = this.service.repairs;
    let newRepairs = this.addedRepairs.map(r => ({
      qty: r.qty,
      note: r.note,
      completed: false,
      repair: this.getRepairId(r)
    }));
    repairs.push(...newRepairs);

    const newCarService = {
      mechanic: this.service.mechanic,
      mechanicName: this.service.mechanicName,
      carNumber: this.service.carNumber,
      car: this.service.car._id,
      milesAtService: this.service.milesAtService,
      note: this.service.note,
      visitType: this.service.visitType,
      priceOfOtherWork: this.service.priceOfOtherWork,
      status: 'COMPLETED',
      repairs,
      bayNumber: (this.service.bayNumber),
    }
    return newCarService;
  }
  viewFullHistory(){
    this.router.navigate(['/services/history', this.service.carNumber], { relativeTo: this.route })
  }

  addRepair() {
    let item = {
      name: "Select Repair",
      dropDownItems: this.allRepairs.map(r => ({ ...r, value: r.name })),
      filteredDropDownItems: this.allRepairs.map(r => ({ ...r, value: r.name })),
      actionText: "Add Repair",
    }
    let dialogRef = this.dialog.open(SelectItemComponent, {
      width: "400px",
      autoFocus: false,
      data: { item, selectedItem: null }
    });

    let closedSub = dialogRef.afterClosed().subscribe(async newRepair => {
      if (!newRepair) return;
      this.addedRepairs.push({ name: newRepair, qty: 1 });
    });
    this.subs.push(closedSub);
  }

  markAsWaiting() {
    let dialogRef = this.dialog.open(AddToWaitingComponent, {
      width: "400px",
      autoFocus: false,
      data: { info: this.service.waitingInfo }
    });

    let closedSub = dialogRef.afterClosed().subscribe(async res => {
      if (!res) {
        return;
      }
      let data = await this.carServiceService.waiting(res, this.service._id).toPromise();
      let bar = this.snackbar.open(`Successfully added to waiting area`, "dismiss", { duration: 2000 });
      bar.afterDismissed().subscribe(x => {
        this.router.navigate(['/services'], { queryParams: { link: 'WAITING' } })
      })
    });
    this.subs.push(closedSub);
  }

  removeRepair(repair, i) {
    this.service.repairs.splice(i, 1);
  }

  removeAdddedRepair(rep, i) {
    this.addedRepairs.splice(i, 1);
  }

}

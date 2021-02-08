import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddToWaitingComponent } from 'src/app/dialogs/add-to-waiting/add-to-waiting.component';
import { CarFullInfo, Service, subNavInfo } from 'src/app/models/car.model';
import { AuthService } from 'src/app/services/auth.service';
import { CarServiceService } from 'src/app/services/car-service.service';

@Component({
  selector: 'app-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})


export class WorkPageComponent implements OnInit, OnDestroy {
  subNavInfo: subNavInfo = {
    actionText: 'Mark As Waiting',
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
  constructor(
    private carServiceService: CarServiceService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
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
      this.car = this.InfoToCard(this.service.car, this.service)
      this.loading = false;
    });

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
  async markCompete() {
    let newStatus = "COMPLETED";

    this.service.status = newStatus;
    try {
      await this.carServiceService.editUServiceStatus(newStatus, this.service._id).toPromise();
      let bar = this.snackbar.open("Updated successfully", "dismiss", { duration: 3000 });
      bar.afterDismissed().subscribe(x => {
        this.router.navigate(['/services'], { queryParams: { link: 'COMPLETED' } })
      })
    } catch (err) {
      this.snackbar.open("An error . Please try again", "dismiss", { duration: 3000, panelClass: 'bar-panel' });
    }
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

}

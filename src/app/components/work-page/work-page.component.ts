import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddToWaitingComponent } from 'src/app/dialogs/add-to-waiting/add-to-waiting.component';
import { Service, subNavInfo } from 'src/app/models/car.model';
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
  service: Service;
  subs: Subscription[] = [];
  constructor(private carServiceService: CarServiceService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  async ngOnInit() {
    this.route.params.subscribe(async p => {
      this.service = await this.carServiceService.getServiceDetail(p.id).toPromise() as Service;
    });

  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  markCompete() {

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
}

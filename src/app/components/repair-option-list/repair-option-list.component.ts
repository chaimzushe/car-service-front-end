import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { subNavInfo } from 'src/app/models/car.model';
import { RepairService } from 'src/app/services/repair.service';

@Component({
  selector: 'app-repair-option-list',
  templateUrl: './repair-option-list.component.html',
  styleUrls: ['./repair-option-list.component.scss']
})
export class RepairOptionListComponent implements OnInit, OnDestroy {
  subNavInfo: subNavInfo = {
    actionText: 'New Repair',
    actionLink: ['edit', 'new'],
    backLink: '/home',
    hideFilter: true
  }

  subs: Subscription[] = [];
  noItemsText = "Loading...";
  repairs = [];
  filteredRepairs = [];
  constructor(private repairService: RepairService , private router: Router, private route: ActivatedRoute, private dialog: MatDialog ) { }

  async ngOnInit() {
    this.filteredRepairs = this.repairs = await this.repairService.getAllRepairs().toPromise() as [];
  }


  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  navigateToEdit(car) {
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  viewItem(car){
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  deleteItem(car, i){
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this repair?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.repairs.splice(i, 1);
      let removeSub = this.repairService.removeRepair(car._id).subscribe(x => {
        //this.repairs.splice(i, 1);
      });
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

  search(e){
    this.filteredRepairs = this.repairs.filter( r => r.name.toLowerCase().startsWith(e.toLowerCase()));
    if(this.filteredRepairs.length === 0){
      this.noItemsText = "No Repairs found";
    }

  }

}

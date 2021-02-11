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
  onlyActive = false;
  subs: Subscription[] = [];
  noItemsText = "Loading...";
  repairs = [];
  filteredRepairs = [];
  constructor(private repairService: RepairService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) { }

  async ngOnInit() {
    this.repairs = await this.repairService.getAllRepairs().toPromise() as [];
    this.filteredRepairs = this.mapRepairsToCard(this.repairs);
  }
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  mapRepairsToCard(repairs) {
    return repairs.map(r => {
      return ({
        _id: r._id,
        header: r.name,
        price: r.price,
        middles: [
          { key: 'Check after interval of', value: `${r.intervalCheck} days` },
          { key: 'Check after traveled', value: `${r.checkWhenMilageIsAt} miles` },
          { key: 'Check if visit is', value: `${(r.forVisit || 'N/A')}` },
          { key: 'Show last time done', value: `${(r.showLastPerformed ? 'Yes' : 'No')}` },
        ],
        bottom: (r.active ? 'Active' : 'Inactive'),
        warn: !r.active
      })
    });
  }

  toggleActive() {
    console.log(this.onlyActive);
    if (this.onlyActive) this.filteredRepairs = this.repairs.filter(r => r.active);
    else this.filteredRepairs = this.repairs.filter(r => r);
    this.filteredRepairs = this.mapRepairsToCard(this.filteredRepairs);
  }

  navigateToEdit(reapir) {
    this.router.navigate(['edit', reapir._id], { relativeTo: this.route });
  }



  deleteItem(rep, i) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this repair?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.repairs = this.repairs.filter(r => r.name !== rep.name)
      this.filteredRepairs = this.filteredRepairs.filter(r => r.header !== rep.header)
      let removeSub = this.repairService.removeRepair(rep._id).subscribe(x => { });
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

  search(e) {
    this.filteredRepairs = this.repairs.filter(r => r.name.toLowerCase().startsWith(e.toLowerCase()));
    this.filteredRepairs = this.mapRepairsToCard(this.filteredRepairs);
    this.onlyActive = false;
    if (this.filteredRepairs.length === 0) {
      this.noItemsText = "No Repairs found";
    }

  }

}

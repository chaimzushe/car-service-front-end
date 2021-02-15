import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  list: any = { header: 'Repairs', items: [], noItemsText: "Loading...", toggle: true }
  repairs = [];
  constructor(private repairService: RepairService,
    private router: Router,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    this.repairs = await this.repairService.getAllRepairs().toPromise() as [];
    this.list.items = this.mapRepairsToCard(this.repairs);
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

  toggleActive(isActive) {
    this.onlyActive = isActive;
    if (this.onlyActive) this.list.items = this.repairs.filter(r => r.active);
    else this.list.items = this.repairs.filter(r => r);
    this.list.items = this.mapRepairsToCard(this.list.items);
  }

  navigateToEdit(repair) {
    this.router.navigate(['edit', repair._id], { relativeTo: this.route });
  }



  async deleteItem(rep) {
    this.repairs = this.repairs.filter(r => r.name !== rep.name)
    this.list.items = this.list.items.filter(r => r.header !== rep.header)
    if (this.list.items.length === 0) this.list.noItemsText = "No Repairs found";
    await this.repairService.removeRepair(rep._id).toPromise();
  }

  search(e) {
    this.list.items = this.repairs.filter(r => r.name.toLowerCase().startsWith(e.toLowerCase()));
    this.list.items = this.mapRepairsToCard(this.list.items);
    this.onlyActive = false;
    if (this.list.items.length === 0) this.list.noItemsText = "No Repairs found";
  }

}

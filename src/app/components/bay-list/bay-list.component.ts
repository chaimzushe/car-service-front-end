import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { subNavInfo } from 'src/app/models/car.model';
import { BayService } from 'src/app/services/bay.service';

@Component({
  selector: 'app-bay-list',
  templateUrl: './bay-list.component.html',
  styleUrls: ['./bay-list.component.scss']
})
export class BayListComponent implements OnInit {

  subNavInfo: subNavInfo = {
    actionText: 'New Bay',
    actionLink: ['edit', 'new'],
    backLink: '/home',
    hideFilter: true
  }
  subs: Subscription[] = [];
  noItemsText = "Loading...";
  bays = [];
  filteredBays = [];
  constructor(private bayService: BayService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }



  async ngOnInit() {
    this.bays = await this.bayService.getAllBays().toPromise() as [];
    this.filteredBays = this.mapBayToCard(this.bays);
    if(this.filteredBays .length === 0)  this.noItemsText = "No bays found";
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  mapBayToCard(bays) {
    return bays.map(b => {
      return ({
        _id: b._id,
        header: b.name,
        middles: [
          { key: 'Bay Number', value: `${b.number}` },
          { key: 'Capacity', value: `${b.capacity} cars` },
        ],
        bottom: `${!b.currentCars.length ? 'Empty' : 'Occupied' }`,
        warn: false
      })
    });
  }

  navigateToEdit(car) {
    this.router.navigate(['edit', car._id], { relativeTo: this.route });
  }

  deleteItem(user, i) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this user?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.bays = this.bays.filter(u => u.name !== user.name)
      this.filteredBays = this.filteredBays.filter(u => u.header !== user.header)
      let removeSub = this.bayService.removeBay(user._id).subscribe(x => {
        //this.bays.splice(i, 1);
      });
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

  search(e) {
    this.filteredBays = this.bays.filter(r => r.name.toLowerCase().startsWith(e.toLowerCase()));
    this.filteredBays = this.mapBayToCard(this.filteredBays);
    if (this.filteredBays.length === 0) {
      this.noItemsText = "No bays found";
    }

  }


}

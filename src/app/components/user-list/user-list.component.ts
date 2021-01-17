import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';
import { subNavInfo } from 'src/app/models/car.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  subNavInfo: subNavInfo = {
    actionText: 'New User',
    actionLink: ['edit', 'new'],
    backLink: '/home',
    hideFilter: true
  }
  subs: Subscription[] = [];
  noItemsText = "Loading...";
  users = [];
  filteredUsers = [];
  constructor(private userService: UserService ,
              private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog) { }

  async ngOnInit() {
    this.filteredUsers = this.users = await this.userService.getAllUsers().toPromise() as [];
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
      data: { msg: 'Are you sure you would like to delete this user?' },
      autoFocus: false
    });

    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.users.splice(i, 1);
      let removeSub = this.userService.removeUser(car._id).subscribe(x => {
        //this.users.splice(i, 1);
      });
      this.subs.push(removeSub);
    });
    this.subs.push(dialogSub);
  }

  search(e){
    this.filteredUsers = this.users.filter( r => r.name.toLowerCase().startsWith(e.toLowerCase()));
    if(this.filteredUsers.length === 0){
      this.noItemsText = "No users found";
    }

  }

}

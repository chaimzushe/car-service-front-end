import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
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

  list: any = { header: 'Users', items: [], noItemsText: 'Loading...' };
  subs: Subscription[] = [];
  noItemsText = "Loading...";
  users = [];
  filteredUsers = [];
  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }



  async ngOnInit() {
    this.users = await this.userService.getAllUsers().toPromise() as [];
    this.list.items = this.mapUserToCard(this.users);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  mapUserToCard(users) {
    return users.map(u => {
      return ({
        _id: u._id,
        header: u.name,
        middles: [
          { key: 'Email', value: `${u.email}` },
        ],
        bottom: u.role,
        warn: false
      })
    });
  }


  navigateToEdit(user) {
    console.log(user)
    this.router.navigate(['edit', user._id], { relativeTo: this.route });
  }

  async deleteItem(user) {
    this.users = this.users.filter(u => u.name !== user.name)
    this.list.items = this.list.items.filter(u => u.header !== user.header)
    if (this.list.items.length === 0) this.list.noItemsText = "No users found";
    await this.userService.removeUser(user._id).toPromise();
  }

  search(e) {
    this.filteredUsers = this.users.filter(r => r.name.toLowerCase().startsWith(e.toLowerCase()));
    this.list.items = this.mapUserToCard(this.filteredUsers);
    if (this.filteredUsers.length === 0) this.list.noItemsText = "No users found";
  }

}


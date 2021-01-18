import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
settings = [
  {iconClass: 'fal fa-people-carry', name: 'Manage Services', link: 'services', imageUrl: 'receive-splash.jpg', ready: true},
  {iconClass: 'fal fa-tools', name: 'Manage Repairs', link: 'repair-options', imageUrl: 'repairs-splash.jpg', ready: true},
  {iconClass: 'fal fa-cars', name: 'Manage cars', link: 'cars', imageUrl: "cars-splash.jpg", ready: true},
  {iconClass: 'fal fa-users', name: 'Manage users', link: 'users',imageUrl: "users-splash.jpg", ready: true},
]

  constructor() { }
  ngOnInit(): void {
  }

}

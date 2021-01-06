import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
settings = [
  {iconClass: 'fal fa-hand-receiving', name: 'Receive car', link: 'register'},
  {iconClass: 'fal fa-tools', name: 'Manage Repairs', link: 'repair-options', ready: true},
  {iconClass: 'fal fa-cars', name: 'Manage cars', link: 'cars', ready: true},
]

  constructor() { }

  ngOnInit(): void {
  }

}

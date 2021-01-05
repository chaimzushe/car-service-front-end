import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
settings = [
  {iconClass: 'fal fa-car', name: 'Receive car', link: 'register'},
  {iconClass: 'fal fa-cog', name: 'Configure Services', link: 'Configure-service'},
  {iconClass: 'fal fa-history', name: 'View Car History', link: 'car-history'},
]
  constructor() { }

  ngOnInit(): void {
  }

}

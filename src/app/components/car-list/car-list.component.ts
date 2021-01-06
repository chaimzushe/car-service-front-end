import { Component, OnInit } from '@angular/core';
import { ICar } from 'src/app/models/car.model';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {

  constructor() { }
  cars: ICar[] = [];
  noItemsText = "No cars found";
  ngOnInit(): void {
  }

}

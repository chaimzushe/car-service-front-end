import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bay } from 'src/app/models/car.model';
import * as moment from 'moment';

@Component({
  selector: 'app-bay-item-card',
  templateUrl: './bay-item-card.component.html',
  styleUrls: ['./bay-item-card.component.scss']
})

export class BayItemCardComponent implements OnInit {
  @Input() bay: Bay;
  @Input() user: any;
  @Output() edited = new EventEmitter();
  @Output() deleted = new EventEmitter();
  @Output() goToWorkPage = new EventEmitter();
  duration: string;
  constructor() {

  }


  ngOnInit(): void {
    this.bay.currentCars.forEach(c => c.duration = `${moment.duration(moment().diff(c.timeIn)).humanize()}`)
    setInterval(() => {
      this.bay.currentCars.forEach(c => c.duration = `${moment.duration(moment().diff(c.timeIn)).humanize()}`)
    }, (1000 * 60));
  }

  navigateToEdit() {
    this.edited.emit(this.bay)
  }
  deleteBay() {
    this.deleted.emit(this.bay);
  }

  isOverAnHour(car){
    return car.duration.toLowerCase().includes('hour') || car.duration.toLowerCase().includes('day') || car.duration.toLowerCase().includes('week')
  }

  navigateToWorkPage(event: MouseEvent, car){
    event.stopPropagation();
    this.goToWorkPage.emit(car.serviceId);
  }

}

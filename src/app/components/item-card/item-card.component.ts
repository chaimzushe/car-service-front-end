import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent implements OnInit {
  @Input() index;
  @Input() item;
  @Output() edited = new EventEmitter();
  @Output() deleted = new EventEmitter();
  constructor() {}

  ngOnInit(): void {

  }

  navigateToEdit() {
    this.edited.emit(this.item)
  }
  deleteItem() {
    this.deleted.emit(this.item);
  }
}

import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent implements OnInit, AfterViewInit {
  @ViewChild('host', { static: false }) host: ElementRef;
  @Input() index;
  @Input() item;
  @Output() edited = new EventEmitter();
  @Output() deleted = new EventEmitter();
  highlight = false;
  constructor() { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    if (this.item.highLite) this.animateAndScroll()
  }

  animateAndScroll() {
    this.highlight = true;
    this.host.nativeElement.scrollIntoView(true);
    setTimeout(() => {
      this.highlight = false;
      this.item.highLite = false;
    }, 3000);
  }

  navigateToEdit() {
    this.edited.emit(this.item)
  }
  deleteItem() {
    this.deleted.emit(this.item);
  }
}

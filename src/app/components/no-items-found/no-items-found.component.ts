import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-items-found',
  templateUrl: './no-items-found.component.html',
  styleUrls: ['./no-items-found.component.scss']
})
export class NoItemsFoundComponent implements OnInit {
  @Input() text ;
  constructor() { }

  ngOnInit(): void {
  }

}

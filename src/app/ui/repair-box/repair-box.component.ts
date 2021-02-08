import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { workRepair } from 'src/app/models/car.model';

@Component({
  selector: 'app-repair-box',
  templateUrl: './repair-box.component.html',
  styleUrls: ['./repair-box.component.scss']
})
export class RepairBoxComponent implements OnInit {
  @Input() repair: workRepair;
  @Output() remove = new EventEmitter();
  @Output() edited = new EventEmitter();
  isEditing: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  editNote() {

  }

  removeRepair() {
    this.remove.emit();
  }

  toggleNote(isEditing){
    this.repair.isEditing = isEditing;
  }

}

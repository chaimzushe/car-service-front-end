import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmActionComponent } from 'src/app/dialogs/confirm-action/confirm-action.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  onlyActive = false;
  @Input() list;
  @Output() navigateToEditClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();
  @Output() scrolled = new EventEmitter();
  @Output() toggleActiveClicked = new EventEmitter();
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.list)
  }

  navigateToEdit(item) {
    this.navigateToEditClicked.emit(item)
  }

  toggleActive() {
    this.toggleActiveClicked.emit(this.onlyActive)
  }

  onScroll() {
    this.scrolled.emit()
  }

  async deleteItem(item) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      width: '250px',
      data: { msg: 'Are you sure you would like to delete this repair?' },
      autoFocus: false
    });

    let result = await dialogRef.afterClosed().toPromise();
    if (!result) return;
    else this.deleteClicked.emit(item)
  }

}

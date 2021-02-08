import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss']
})
export class SelectItemComponent implements OnInit {
  item: any;
  selectedItem: any;
  constructor(
    private dialogRef: MatDialogRef<SelectItemComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.selectedItem = data.selectedItem;
    this.item = data.item;
  }

  ngOnInit(): void {
  }

  filterItems(e) {
    this.item.filteredDropDownItems = this.item.dropDownItems.filter((c) => {
      return (
        c.name.toLowerCase().includes(e.currentTarget.value.toLowerCase())
      );
    });
  }

  confirm() {
    this.dialogRef.close(this.selectedItem);
  }

}







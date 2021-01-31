import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-to-bay',
  templateUrl: './assign-to-bay.component.html',
  styleUrls: ['./assign-to-bay.component.scss']
})
export class AssignToBayComponent implements OnInit {
  selectedBay;
  bays: { name: string, disabled: boolean, value: number } [] = [];
  constructor(
    private dialogRef: MatDialogRef<AssignToBayComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.selectedBay = data.bay;
    this.bays = Array.from({ length: 10 }, (k, i) => {
      return { name: `Bay ${i + 1}`, value: (i + 1), disabled: this.inUse(data.usedBays, i) }
    });
  }
  inUse(bays, i): any {
    return bays.find(b => b === (i + 1));
  }

  ngOnInit(): void {
  }

  confirm() {
    this.dialogRef.close(this.selectedBay);
  }

}

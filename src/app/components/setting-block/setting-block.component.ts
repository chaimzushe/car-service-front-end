import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-setting-block',
  templateUrl: './setting-block.component.html',
  styleUrls: ['./setting-block.component.scss']
})
export class SettingBlockComponent implements OnInit {
@Input() setting;
  constructor(private snackbar : MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.setting)
  }

  navigate(){
    this.snackbar.open("Work in progress. Thank you for your patience 😊 ", "dismiss", {duration: 3000, panelClass: "err-panel"})
  }

}

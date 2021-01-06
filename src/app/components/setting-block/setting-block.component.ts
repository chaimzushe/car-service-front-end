import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-block',
  templateUrl: './setting-block.component.html',
  styleUrls: ['./setting-block.component.scss']
})
export class SettingBlockComponent implements OnInit {
  @Input() setting;
  constructor(private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    console.log(this.setting)
  }

  navigate() {
    if (this.setting.ready) {
      this.router.navigate([this.setting.link])
    } else {
      return this.snackbar.open("Work in progress. Thank you for your patience 😊 ", "dismiss", { duration: 3000, panelClass: "err-panel" })
    }
  }

}

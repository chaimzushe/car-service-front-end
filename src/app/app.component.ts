import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private snackbar: MatSnackBar){

  }

  ngOnInit(){
    this.authService.retrieveAuthFromUrl();
    if(window.screen.width < 650 && this.showFooter()){
      let msg = "Looks like you are using a mobile device. This site is not optimized for small screens";
      return this.snackbar.open(msg, "dismiss", { duration: 10000, panelClass: "err-panel" })
    }
  }
  showFooter(){
    return !window.location.href.includes('entry-page')
  }
}

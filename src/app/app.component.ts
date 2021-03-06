import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import * as FullStory from '@fullstory/browser';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: any;
  constructor(private authService: AuthService, private snackbar: MatSnackBar) {
    FullStory.init({
      orgId: '10KCHC',
      devMode: !environment.production
    });
  }

  ngOnInit() {
    this.authService.retrieveAuthFromUrl();
    let userSub = this.authService.userSubject.subscribe(user => {
      if (user) {
        this.user = user;
        FullStory.identify(user._id);
        FullStory.setUserVars({
          name: user.name,
          email: user.email
        });

      }
    })
    if (this.user) userSub.unsubscribe()
  }
  showFooter() {
    return !window.location.href.includes('entry-page')
  }
}

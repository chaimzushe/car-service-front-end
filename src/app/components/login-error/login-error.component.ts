import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    let userSub = this.authService.userSubject.subscribe(user => {
      if (user) {
        this.router.navigate(["/home"])
      }
    })
  }

  login() {
    this.authService.login()
  }



}

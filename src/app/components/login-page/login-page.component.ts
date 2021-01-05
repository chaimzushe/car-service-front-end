import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  email  = "";
  password = "";
  constructor(private router: Router, private snackbar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
  }

async login(){
    console.log(this.email, this.password);
    const isAuthenticated =  await this.authService.verifyPassword(this.email, this.password);
    if(isAuthenticated){
      sessionStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/home']);
    } else {
     this.snackbar.open("Password incorrect", "dismiss", {duration: 3000, panelClass: "err-panel"})
    }
  }

}

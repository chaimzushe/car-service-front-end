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

async login(){}

}

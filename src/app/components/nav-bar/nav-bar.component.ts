import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  links = [
    {name: 'Repairs', route: '/repair-options' },
    {name: 'Users', route: '/users' },
    {name: 'Cars', route: '/cars' },
    {name: 'Services', route: '/services' },
  ]
  user: any;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    let userSub = this.authService.userSubject.subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
  }

  login(){
    this.authService.login();
  }

  logout(){
    this.authService.logOut();
    this.router.navigate(['entry-page'])
  }

}

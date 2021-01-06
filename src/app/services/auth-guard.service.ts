import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router) {

  }

  async canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!!loggedIn || true) {
      return true;
    }
    else {
      this.router.navigate(["/login"])
      return false;
    }
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { baseApi } from "../util/global-config";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router, private http: HttpClient, private snackBar: MatSnackBar) {

  }

  async canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot) {

    try {
      const data = await this.http.put(`${baseApi}/userinfo`, null).toPromise() as any;
      if (!! data) {
        return true;
      }
      else {
        this.router.navigate(['entry-page'], {queryParams: data.msg})
      }
    } catch (err) {
      this.router.navigate(['entry-page'])
      return false;
    }
  }
}

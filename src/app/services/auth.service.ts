import { Injectable } from '@angular/core';
import { redirectUrl } from "./../util/global-config";
import { BehaviorSubject } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { baseApi } from '../util/global-config';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const AUTH_CONFIG = {
  domain: "car-repair.us.auth0.com",
  clientID: "QUQO34B26bF1spwauthdnpcUT4NLAiri"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject = new BehaviorSubject(undefined);
  user$ = this.userSubject.asObservable().pipe(
    filter(user => !!user)
  );
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: "token id_token",
    redirectUri: redirectUrl
  });
  currentUser: Object = {};
  constructor(private router: Router, private http: HttpClient) {

  }

  login() {
    return this.auth0.authorize({})
  }

  retrieveAuthFromUrl() {
    this.auth0.parseHash((err, authResult) => {
      if (err) return console.log("An error accoured");
      else if (authResult && authResult.idToken) this.setSession(authResult);
      window.location.hash = '';
      this.userInfo()
    })
  }

  setSession(authResult) {
    const todayTimeStamp = (new Date()).getTime();
    let expiresAt = (new Date(todayTimeStamp + authResult.expiresIn * (60000 / 60))).getTime();
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt));
  }

  getExpiration() {
    const expires = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expires);
    return new Date(expiresAt);
  }

  logOut() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.currentUser = null;
    this.userSubject.next(null);
    this.router.navigate(['/home'])
  }

  isLoggedIn() {
    return localStorage.getItem("id_token")
  }
  userInfo() {
    return this.http.put(`${baseApi}/userinfo`, null).pipe(
      shareReplay(),
      tap(user => {
        this.currentUser = user;
        this.userSubject.next(user)
      })
    )
      .subscribe()
  }
}

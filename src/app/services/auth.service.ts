import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  verifyPassword(email: string, password: string) {
    return Promise.resolve(password ===  "Moshiach770");
  }

  constructor() { }
}

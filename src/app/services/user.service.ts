import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {baseApi} from '../util/global-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }



  getUserDetail(userId: any) {
    return this.http.get(`${baseApi}/user/${userId}`);
  }
  getAllUsers() {
    return this.http.get(`${baseApi}/users`);
  }

  addUser(user: any) {
    return this.http.post(`${baseApi}/add-user`, user);
  }

  editUser(user: any, id: number) {
    return this.http.post(`${baseApi}/update-user/${id}`, user);
  }

  removeUser(_id: any) {
    return this.http.post(`${baseApi}/delete-user`, { id: _id });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  baseApi = 'https://car-service-shop.herokuapp.com/api'
 // baseApi = 'http://localhost:2000/api'


  getUserDetail(userId: any) {
    return this.http.get(`${this.baseApi}/user/${userId}`);
  }
  getAllUsers() {
    return this.http.get(`${this.baseApi}/users`);
  }

  addUser(user: any) {
    return this.http.post(`${this.baseApi}/add-user`, user);
  }

  editUser(user: any, id: number) {
    return this.http.post(`${this.baseApi}/update-user/${id}`, user);
  }

  removeUser(_id: any) {
    return this.http.post(`${this.baseApi}/delete-user`, { id: _id });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {
  baseApi =  "https://car-service-shop.herokuapp.com/api" //
 // baseApi = 'http://localhost:2000/api'


  constructor(private http : HttpClient) { }

  getAllServices() {
    return this.http.get(`${this.baseApi}/car-services`);
  }
}

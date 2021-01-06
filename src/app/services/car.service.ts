import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  baseApi = "https://car-service-shop.herokuapp.com/"

  constructor(private http: HttpClient) { }

  getCarDetail(carId: any) {
    return this.http.get(`${this.baseApi}/get-car/${carId}`);
  }

  addCar(car: any) {
    debugger
    return this.http.post(`${this.baseApi}/addcar`, car);
  }

  editCar(car: any) {
    return this.http.post(`${this.baseApi}/editcar`, car);
  }
}

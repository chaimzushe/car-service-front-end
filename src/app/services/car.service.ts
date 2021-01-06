import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarService {


  baseApi =  "https://car-service-shop.herokuapp.com/api" // 'http://localhost:2000/api'

  constructor(private http: HttpClient) { }

  getCarDetail(carId: any) {
    return this.http.get(`${this.baseApi}/car/${carId}`);
  }

  //:id

  getAllCars(carId: any) {
    return this.http.get(`${this.baseApi}/cars`);
  }

  addCar(car: any) {
    return this.http.post(`${this.baseApi}/addcar`, car);
  }

  editCar(car: any, id: number) {
    return this.http.post(`${this.baseApi}/update-car/${id}`, car);
  }

  removeCar(_id: any) {
    return this.http.post(`${this.baseApi}/delete-car`, {id: _id});
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {baseApi} from '../util/global-config';
@Injectable({
  providedIn: 'root'
})
export class CarService {





  constructor(private http: HttpClient) { }

  getCarDetail(carId: any) {
    return this.http.get(`${baseApi}/car/${carId}`);
  }

  getCarTypeAhead(searchWord, filter : any= {}) {
    filter.searchWord = searchWord;
    return this.http.post(`${baseApi}/car-typeahead`, filter)
  }


  getAllCars(carId = null) {
    return this.http.get(`${baseApi}/cars`);
  }
  getAllCarsFullInfo(carId = null) {
    return this.http.get(`${baseApi}/cars-all-info`);
  }

  addCar(car: any) {
    return this.http.post(`${baseApi}/addcar`, car);
  }

  editCar(car: any, id: number) {
    return this.http.post(`${baseApi}/update-car/${id}`, car);
  }

  removeCar(_id: any) {
    return this.http.post(`${baseApi}/delete-car`, { id: _id });
  }

  createService(newCarService) {
       return this.http.post(`${baseApi}/add-carService`, newCarService, { responseType: 'blob' })
  }
}

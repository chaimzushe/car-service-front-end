import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {baseApi} from '../util/global-config';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {




  constructor(private http : HttpClient) { }

  getAllServices() {
    return this.http.get(`${baseApi}/car-services`);
  }

  removeService(_id: any) {
    return this.http.post(`${baseApi}/delete-car-service`, { id: _id });
  }

  getFilteredServices(searchWord){
    return this.http.post(`${baseApi}/car-service-filter`, { searchWord });
  }

  applyFilters(filter: any, searchWord) {
    filter.searchWord = searchWord;
    return this.http.post(`${baseApi}/car-service-filter`, filter);
  }

  editUService(service: any, id: number) {
    return this.http.post(`${baseApi}/update-cars-service/${id}`, service);
  }

  editUServiceStatus(status: any, id: number) {
    return this.http.post(`${baseApi}/update-cars-service-status/${id}`, {status});
  }

  assignBay(bay: any, id: any) {
    return this.http.post(`${baseApi}/assign-bay/${id}`, {bay} );
  }


  getServiceDetail(id: any) {
    return this.http.get(`${baseApi}/car-service/${id}`);
  }

  createService(newCarService) {
    return this.http.post(`${baseApi}/add-carService`, newCarService);
  }

}

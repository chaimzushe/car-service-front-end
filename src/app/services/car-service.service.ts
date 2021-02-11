import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApi, socketIo } from '../util/global-config';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarServiceService {

  socket: any;

  currentBays = Array.from({ length: 10 }, (k, i) => {
    return { name: `Bay ${i + 1}`, value: (i + 1), inUse: false }
  });

  visitTypesColor = {
    Maintenance: 'lightblue',
    Inspection: 'rgb(193 144 185)',
    Accident: '#fd7571f5',
    'TLC Other': '#fff060f5',
    Scheduled: '#60ff69f5',
  }

  bayInUse(bay) {
    return this.currentBays.find(b => b.value === bay && b.inUse);
  }

  constructor(private http: HttpClient) {
    this.socket = io(socketIo);
  }

  getAllServices() {
    return this.http.get(`${baseApi}/car-services`);
  }

  removeService(_id: any) {
    return this.http.post(`${baseApi}/delete-car-service`, { id: _id });
  }


  sendMessage(eventName, data) {
    this.socket.emit(eventName, data);
  }



  listen(eventName) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  downloadPDF(id: any) {
    return this.http.get(`${baseApi}/car-service-pdf/${id}`, { responseType: 'blob' });
  }

  getFilteredServices(searchWord) {
    return this.http.post(`${baseApi}/car-service-filter`, { searchWord });
  }

  applyFilters(filter: any, searchWord) {
    filter.searchWord = searchWord;
    return this.http.post(`${baseApi}/car-service-filter`, filter);
  }

  editUService(service: any, id: any) {
    return this.http.post(`${baseApi}/update-cars-service/${id}`, service);
  }

  editUServiceStatus(status: any, id: any) {
    return this.http.post(`${baseApi}/update-cars-service-status/${id}`, { status });
  }

  assignBay(bay: any, id: any) {
    return this.http.post(`${baseApi}/assign-bay/${id}`, { bay });
  }

  assignUser(user, id) {
    return this.http.post(`${baseApi}/assign-user/${id}`, user);
  }

  waiting(waitingInfo, id: any) {
    return this.http.post(`${baseApi}/car-waiting/${id}`, waitingInfo);
  }

  getServiceDetail(id: any) {
    return this.http.get(`${baseApi}/car-service/${id}`);
  }

  createService(newCarService) {
    return this.http.post(`${baseApi}/add-carService`, newCarService);
  }

}

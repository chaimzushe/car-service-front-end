import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepairService {

  constructor(private http: HttpClient) { }
  //baseApi = 'https://car-service-shop.herokuapp.com/api'
  baseApi = 'http://localhost:2000/api'


  getRepairDetail(repairId: any) {
    return this.http.get(`${this.baseApi}/repair/${repairId}`);
  }
  getAllRepairs() {
    return this.http.get(`${this.baseApi}/repairs`);
  }

  addRepair(repair: any) {
    return this.http.post(`${this.baseApi}/add-repair`, repair);
  }

  editRepair(repair: any, id: number) {
    return this.http.post(`${this.baseApi}/update-repair/${id}`, repair);
  }

  removeRepair(_id: any) {
    return this.http.post(`${this.baseApi}/delete-repair`, { id: _id });
  }
}

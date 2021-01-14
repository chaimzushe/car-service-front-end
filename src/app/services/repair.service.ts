import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {baseApi} from '../util/global-config';

@Injectable({
  providedIn: 'root'
})
export class RepairService {

  constructor(private http: HttpClient) { }

  getRepairDetail(repairId: any) {
    return this.http.get(`${baseApi}/repair/${repairId}`);
  }
  getAllRepairs() {
    return this.http.get(`${baseApi}/repairs`);
  }

  addRepair(repair: any) {
    return this.http.post(`${baseApi}/add-repair`, repair);
  }

  editRepair(repair: any, id: number) {
    return this.http.post(`${baseApi}/update-repair/${id}`, repair);
  }

  removeRepair(_id: any) {
    return this.http.post(`${baseApi}/delete-repair`, { id: _id });
  }
}

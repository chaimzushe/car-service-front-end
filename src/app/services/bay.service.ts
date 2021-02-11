import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {baseApi} from '../util/global-config';

@Injectable({
  providedIn: 'root'
})
export class BayService {
  constructor(private http: HttpClient) { }

  getBayDetail(bayId: any) {
    return this.http.get(`${baseApi}/bay/${bayId}`);
  }
  getAllBays() {
    return this.http.get(`${baseApi}/bays`);
  }

  addBay(bay: any) {
    return this.http.post(`${baseApi}/add-bay`, bay);
  }

  editBay(bay: any, id: number) {
    return this.http.post(`${baseApi}/update-bay/${id}`, bay);
  }

  removeBay(_id: any) {
    return this.http.post(`${baseApi}/delete-bay`, { id: _id });
  }
}


export interface Repair {
  name: number;
  intervalCheck: number;
  checkWhenMilageIsAt: number;
  price: number;
}

export interface User {
  _id: number;
  name: string;
  email: string;
  roles: [];

}

interface workRepair{
  completed: boolean;
  note: string;
  qty:number;
  repair: Repair;
}

export interface subNavInfo {
  actionText: string;
  backLink: string;
  actionLink: string[];
  gridView?: boolean;
}

export interface Service {
  car: CarFullInfo;
  createdAt: Date;
  mechanic: User;
  milesAtService: number;
  note: string;
  repairs: workRepair[];
  status: string;
  updatedAt: Date;
  visitType: string;
  fields? : [];
  _id: string;
}


export interface CarFullInfo {
  car_id: number;
  vin: string,
  model: string,
  year: number,
  color: string,
  driver: string,
}



// car number
// miles at service
// mechanic
// status
// createdAt
// updatedAt
  // => repairs

          //note



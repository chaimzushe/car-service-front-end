
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

export interface workRepair{
  completed?: boolean;
  note?: string;
  qty:number;
  repair?: Repair;
  name?: string;
  isEditing?: boolean;
}

export interface Bay{
  _id: string;
  name?: string;
  number: number;
  capacity: number;
  currentCars: carInBay[]
}

export interface subNavInfo {
  actionText: string;
  backLink: string;
  actionLink?: string[];
  gridView?: boolean;
  hideFilter?: boolean;
  hideSearch?: boolean;
  sync?: boolean;
}

interface carInBay{
  timeIn: Date;
  carNumber: Number;
  paused: boolean;
  duration: string;
  serviceId: string;
}

export interface Service {
  carNumber: number;
  mechanicName: string;
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
  expanded?: boolean;
  serviceTime: Date;
  totalPrice: number;
  waitingInfo: any;
  bayNumber?: any;
  priceOfOtherWork: number;
  isEditing: boolean;
}


export interface CarFullInfo {
  _id: string;
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



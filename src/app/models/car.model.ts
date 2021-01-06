

export interface ICar {
  _id: string;
  carNumber:number;
  miles: number;
  vin: number;
  imageUrl: string;
  lastRepair: Date | null;
}

export interface Repair {
  name: number;
  intervalCheck: string;
}



export interface User {
  Id: number;
  Name: string;

}

export interface subNavInfo{
  actionText: string;
  backLink: string;
  actionLink: string[];
}



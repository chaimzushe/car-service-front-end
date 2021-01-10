

export interface ICar {
  _id: string;
  carnumber:number;
  miles: number;
  vin: number;
  imageUrl: string;
  lastRepair: Date | null;
}

export interface Repair {
  name: number;
  intervalCheck: number;
  checkWhenMilageIsAt: number;
}



export interface User {
  _id: number;
  name: string;
  email: string;
  roles: [];

}

export interface subNavInfo{
  actionText: string;
  backLink: string;
  actionLink: string[];
  gridView?: boolean;
}


export interface CarFullInfo {
  car_id: number;
  purchase_date: number,
    vin: string,
    owner: string,
    model: string,
    year: number,
    color: string,
    base: string,
    inspct_date: string,
    driver: string,
    turnover: number,
    stage: string,
    broker: string,
    ituraun_id: string,
    lien: string,
    add: string,
    car_desc: string,
    purchasePrice: number,
    '2015Policy': string,
    weeklyCharge: number
}



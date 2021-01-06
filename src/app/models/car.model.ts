

export interface ICar {
  CarNumber:number;
  miles: number;
  visits: RepairVisit[];
  vin: number;
  imageUrl: string;
}

export interface RepairVisit {
  Id: number;
  Date:number;
  issues: Issue[];
  note: [];
  attendedBy: User;
}

export interface Issue {
  Id: number;
  Name: string;
  RecheckInterval: number;

}

export interface User {
  Id: number;
  Name: string;

}



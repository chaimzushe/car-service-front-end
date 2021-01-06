

export interface ICar {
  _id: string;
  carNumber:number;
  miles: number;
  visits: RepairVisit[];
  vin: number;
  imageUrl: string;
  lastRepair: Date | null;
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



import {Degree} from "./Degree";

export class Department {
  public id: number;
  public university_id: number;
  public name: string;
  public degrees: Degree[];

  constructor(data: Department | void) {
    if(data === undefined) {
      this.id = 0;
      this.university_id = 0;
      this.name = '';
      this.degrees = <Degree[]>[];
    }
    else {
      this.id = data.id;
      this.university_id = data.university_id;
      this.name = data.name;
      this.degrees = <Degree[]>[];
      if(data.hasOwnProperty('degrees')){
        data.degrees.forEach((degree: Degree) => {
          this.degrees.push(new Degree(degree));
        })
      }
    }
  }
}

export class User {
  public id: number;
  public name: string;
  public family_name: string;
  public email: string;
  public gender: string;
  public date_of_birth: string;
  public nationality: string;
  public country: string;
  public address: string;
  public city: string;
  public postal_code: string;
  public phone_number: string;
  public home_university: number;
  public degree: number;
  public identity_no: string;
  public year: string;
  public is_complete: boolean;

  constructor(data: User | void) {
    if(data === undefined) {
      this.id = 0;
      this.name = '';
      this.family_name = '';
      this.email = '';
      this.gender = '';
      this.date_of_birth = '';
      this.nationality = '';
      this.country = '';
      this.address = '';
      this.city = '';
      this.postal_code = '';
      this.phone_number = '';
      this.home_university = 0;
      this.degree = 0;
      this.identity_no = '';
      this.year = '';
      this.is_complete = false;
    }
    else {
      this.id = data.id;
      this.name = data.name;
      this.family_name = data.family_name;
      this.email = data.email;
      this.gender = data.gender;
      this.date_of_birth = data.date_of_birth;
      this.nationality = data.nationality;
      this.country = data.country;
      this.address = data.address;
      this.city = data.city;
      this.postal_code = data.postal_code;
      this.phone_number = data.phone_number;
      this.home_university = data.home_university;
      this.degree = data.degree;
      this.identity_no = data.identity_no;
      this.year = data.year;
      this.is_complete = data.is_complete;
    }
  }
}

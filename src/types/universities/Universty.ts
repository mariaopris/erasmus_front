import {IscedCode} from "./IscedCode";
import axios from "axios";
import Swal from "sweetalert2";
import {Department} from "./Department";
import {Degree} from "./Degree";

export class Universty {
  public id: number;
  public name: string;
  public email: string;
  public country: string;
  public code: string;
  public coordinator: string;
  public mobility_period: number;
  public isced_codes: IscedCode[];
  public years: string[] | string;
  public languages: [] | string;
  public description: string;
  public departments: Department[];
  public degrees: Degree[];
  public no_required_credits: number;

  constructor(data: Universty | void) {
    if (data === undefined) {
      this.id = 0;
      this.name = '';
      this.email = '';
      this.code = '';
      this.country = '';
      this.coordinator = '';
      this.mobility_period = 0;
      this.isced_codes = <IscedCode[]>[];
      this.years = <string[]>[];
      this.languages = [];
      this.description = '';
      this.departments = <Department[]>[];
      this.degrees = <Degree[]>[];
      this.no_required_credits = 0;
    }
    else {
      this.id = data.id;
      this.name = data.name;
      this.email = data.email;
      this.code = data.code;
      this.country = data.country;
      this.coordinator = data.coordinator;
      this.mobility_period = data.mobility_period;
      this.isced_codes = data.isced_codes;
      if (typeof data.years === "string") {
        this.years = JSON.parse(data.years);
      }
      if (typeof data.languages === "string") {
        this.languages = JSON.parse(data.languages);
      }
      this.description = data.description;
      this.departments = <Department[]>[];
      if(data.hasOwnProperty('departments')) {
        data.departments.forEach((department: Department) => {
          this.departments.push(new Department(department));
        })
      }
      this.degrees = <Degree[]>[];
      if(data.hasOwnProperty('degrees')) {
        data.degrees.forEach((degree: Degree) => {
          this.degrees.push(new Degree(degree));
        })
      }
      this.no_required_credits = data.no_required_credits;
    }
  }

  public async add() {
    try {
      let isced_codes = <string[]>[];
      this.isced_codes.forEach((isced_code: IscedCode) => {
        isced_codes.push(isced_code.code);
      })
      await axios.post("http://127.0.0.1:8000/api/universities", {
        form: {
          'name': this.name,
          'email': this.email,
          'code': this.code,
          'country': this.country,
          'coordinator': this.coordinator,
          'mobility_period': this.mobility_period,
          'isced_codes': JSON.stringify(isced_codes),
          'years': JSON.stringify(this.years),
          'languages': JSON.stringify(this.languages),
          'description': this.description,
          'no_required_credits': this.no_required_credits
        },
      })
        .then(async (response) => {
          if (response.data.status) {
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
            })
          } else {
            let message = response.data.message;
            let title = 'Error...';
            if(Object.keys(response.data.errors).length > 0)
            {
              message = response.data.errors[Object.keys(response.data.errors)[0]];
              title = response.data.message;
            }
            Swal.fire({
              title: title,
              text: message,
              icon: 'error',
            })
          }
        });
    } catch (e) {
      console.log('error', e);
      Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    }
  }

  public async update() {
    try {
      let parsed_university = JSON.parse(JSON.stringify(this));

      let isced_codes = <string[]>[];
      this.isced_codes.forEach((isced_code: IscedCode) => {
        isced_codes.push(isced_code.code);
      })
      parsed_university.isced_codes = JSON.stringify(isced_codes);
      parsed_university.years = JSON.stringify(parsed_university.years);
      parsed_university.languages = JSON.stringify(parsed_university.languages);

      await axios.put(`http://127.0.0.1:8000/api/universities/${this.id}`, parsed_university)
        .then(async (response) => {
          await Swal.fire({
            title: 'Done!',
            text: 'University details changed!',
            icon: 'success',
          })
        });
    } catch (e) {
      console.log(e);
      if (e.response?.data?.error) {
        Swal.fire({
          icon: 'error',
          title: 'Ooops..',
          text: e.response.data.error,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ooops..',
          text: "An unknown error has occurred",
        })
      }
    }
  }
}

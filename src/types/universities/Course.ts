import axios from "axios";
import {Universty} from "./Universty";
import {Department} from "./Department";
import {Degree} from "./Degree";
import Swal from "sweetalert2";
import {useRouter} from "vue-router";

const router = useRouter();

export class Course {
  public id: number;
  public university_id: number;
  public department_id: number;
  public degree_id: number;
  public name: string;
  public language: string;
  public level: string;
  public year: string;
  public semester: string;
  public no_credits: number;
  public description: string;
  public tags: string;
  public link: string;
  public university: Universty;
  public department: Department;
  public degree: Degree;

  constructor(data: Course | void) {
    if(data === undefined) {
      this.id = 0;
      this.university_id = 0;
      this.department_id = 0;
      this.degree_id = 0;
      this.name = '';
      this.language = '';
      this.level = '';
      this.year = '';
      this.semester = '';
      this.no_credits = 0;
      this.description = '';
      this.tags = '';
      this.link = '';
      this.university = new Universty();
      this.department = new Department();
      this.degree = new Degree();
    }
    else {
      this.id = data.id;
      this.university_id = data.university_id;
      this.department_id = data.department_id;
      this.degree_id = data.degree_id;
      this.name = data.name;
      this.language = data.language;
      if (typeof data.language === "string") {
        this.language = JSON.parse(data.language);
      }
      this.level = data.level;
      this.year = data.year;
      this.semester = data.semester;
      if (typeof data.semester === "string") {
        this.semester = JSON.parse(data.semester);
      }
      this.no_credits = data.no_credits;
      this.description = data.description;
      this.tags = data.tags;
      this.link = data.link;
      this.university = new Universty(data.university);
      this.department = new Department(data.department);
      this.degree = new Degree(data.degree);
    }
  }

  public async save() {
    try {
      await axios.patch("http://127.0.0.1:8000/api/courses/"+this.id, {
        'university_id': this.university.id,
        'department_id': this.department.id,
        'degree_id': this.degree.id,
        'name': this.name,
        'language': JSON.stringify(this.language),
        'level': this.level,
        'year': this.year,
        'semester': JSON.stringify(this.semester),
        'no_credits': this.no_credits,
        'description': this.description,
        'tags': this.tags,
        'link': this.link,
      })
        .then(async (response) => {
          if (response.data.status) {
            await Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
            })

            await router.push('/courses');
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
    }
    catch (e) {
      console.log('error', e);
      await Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    }
  }

  public async add(university: Universty, department: Department, degree: Degree) {
    try {
      await axios.post("http://127.0.0.1:8000/api/courses", {
        form: {
          'university_id': university.id,
          'department_id': department.id,
          'degree_id': degree.id,
          'name': this.name,
          'language': JSON.stringify(this.language),
          'level': this.level,
          'year': this.year,
          'semester': JSON.stringify(this.semester),
          'no_credits': this.no_credits,
          'description': this.description,
          'tags': this.tags,
          'link': this.link,
        },
      })
        .then(async (response) => {
          if (response.data.status) {
            await Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
            })

            await router.push('/courses');
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
    }
    catch (e) {
      console.log('error', e);
      await Swal.fire({
        icon: 'error',
        title: 'Ooops..',
        text: e.response.data.error,
      })
    }
  }

}

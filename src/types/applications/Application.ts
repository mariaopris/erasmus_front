export class Application {
  public id: number;
  public user_id: number;
  public university_id: number;
  public status: string;
  public selection_score: number;
  public feedback_comments: string;
  public feedback_admin_id: number;
  public academic_year: string;
  public first_name: string;
  public last_name: string;
  public email: string;
  public date_of_birth: string;
  public phone: string;
  public id_number: string;
  public faculty: string;
  public current_study_year: string;
  public education_field: string;
  public gpa: number;
  public summary: string;
  public mobility_program: string;
  public period_of_mobility: string;
  public mobility_start_date: string;
  public mobility_end_date: string;
  public destination_type: string;
  public home_university: string;
  public destination_1: string;
  public destination_2: string;
  public destination_3: string;
  public placement_country: string;
  public created_at: Date | string;
  public university_name: string;

  constructor(data: Application | void) {
    if (data === undefined)
    {
      this.id = 0;
      this.user_id = 0;
      this.university_id = 0;
      this.status = 'Waiting for approval';
      this.selection_score = 0;
      this.feedback_comments = '';
      this.feedback_admin_id = 0;
      this.academic_year = '';
      this.first_name = '';
      this.last_name = '';
      this.email = '';
      this.date_of_birth = '';
      this.phone = '';
      this.id_number = '';
      this.faculty = '';
      this.current_study_year = '';
      this.education_field = '';
      this.gpa = 0;
      this.summary = '';
      this.mobility_program = 'long';
      this.period_of_mobility = '';
      this.mobility_start_date = '';
      this.mobility_end_date = '';
      this.destination_type = '';
      this.home_university = '';
      this.destination_1 = '';
      this.destination_2 = '';
      this.destination_3 = '';
      this.placement_country = '';
      this.created_at = '';
      this.university_name = '';
    }
    else {
      this.id = data.id;
      this.user_id = data.user_id;
      this.university_id = data.university_id;
      this.status = data.status;
      this.selection_score = data.selection_score;
      this.feedback_comments = data.feedback_comments;
      this.feedback_admin_id = data.feedback_admin_id;
      this.academic_year = data.academic_year;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.email = data.email;
      this.date_of_birth = data.date_of_birth;
      this.phone = data.phone;
      this.id_number = data.id_number;
      this.faculty = JSON.parse(data.faculty);
      this.current_study_year = data.current_study_year;
      this.education_field = JSON.parse(data.education_field);
      this.gpa = data.gpa;
      this.summary = data.summary;
      this.mobility_program = data.mobility_program;
      this.period_of_mobility = data.period_of_mobility;
      this.mobility_start_date = data.mobility_start_date;
      this.mobility_end_date = data.mobility_end_date;
      this.destination_type = data.destination_type;
      this.home_university = data.home_university;
      this.destination_1 = data.destination_1;
      this.destination_2 = data.destination_2;
      this.destination_3 = data.destination_3;
      this.placement_country = data.placement_country;
      data.created_at = new Date(data.created_at);
      this.created_at = data.created_at.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      this.university_name = data.university_name;
    }
  }
}

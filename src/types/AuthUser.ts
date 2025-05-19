export class AuthUser {
  id: number;
  email: string;
  name: string;
  family_name: string;

  constructor(data: AuthUser | void) {
    if(data === undefined) {
      this.id = 0;
      this.email = '';
      this.name = '';
      this.family_name = '';
    }
    else {
      this.id = data.id;
      this.email = data.email;
      this.name = data.name;
      this.family_name = data.family_name;
    }
  }
}

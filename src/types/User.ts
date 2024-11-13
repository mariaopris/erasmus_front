export class User {
  public id: number;
  public name: string;
  public email: string;

  constructor(data: User | void) {
    if(data === undefined) {
      this.id = 0;
      this.name = '';
      this.email = '';
    }
    else {
      this.id = data.id;
      this.name = data.name;
      this.email = data.email;
    }
  }
}

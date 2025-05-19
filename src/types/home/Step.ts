export class Step {
  public id: number;
  public type: string;
  public tag: string;
  public status: string;
  public name: string;
  public email: string;
  public user_id: number;

  constructor(data: Step | void) {
    if(data === undefined) {
      this.id = 0;
      this.type = '';
      this.tag = '';
      this.status = '';
      this.name = '';
      this.email = '';
      this.user_id = 0;
    }
    else {
      this.id = data.id;
      this.type = data.type;
      this.tag = data.tag;
      this.status = data.status;
      this.name = '';
      this.email = '';
      this.user_id = data.user_id;
    }
  }
}

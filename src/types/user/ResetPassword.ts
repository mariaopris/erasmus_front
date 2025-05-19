export class ResetPassword {
  public password_current: string;
  public password: string;
  public password_confirmation: string;

  constructor(data: ResetPassword | void) {
    if(data === undefined) {
      this.password_current = '';
      this.password = '';
      this.password_confirmation = '';
    }
    else {
      this.password_current = data.password_current;
      this.password = data.password;
      this.password_confirmation = data.password_confirmation;
    }
  }
}

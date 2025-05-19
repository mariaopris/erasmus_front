import {User} from "../user/User";

export class Documentt {
  public id: number;
  public user_id: number;
  public type: string;
  public status: string;
  public path: string;
  public feedback: string;
  public user: User;
  public created_at: Date | string;

  constructor(data: Documentt | void) {
    if(data === undefined) {
      this.id = 0;
      this.user_id = 0;
      this.type = '';
      this.status = 'Not Available';
      this.path = '';
      this.feedback = '';
      this.user = new User();
      this.created_at = '';
    }
    else {
      this.id = data.id;
      this.user_id = data.user_id;
      this.type = data.type;
      this.status = data.status;
      this.path = data.path;
      this.feedback = data.feedback;
      if(data.user !== null) {
        this.user = new User(data.user);
      }
      data.created_at = new Date(data.created_at);
      this.created_at = new Date(data.created_at).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
  }
}

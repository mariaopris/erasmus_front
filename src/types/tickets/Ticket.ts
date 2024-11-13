import {Message} from "./Message";
import {User} from "../User";

export class Ticket {
  public id: number;
  public user_id: number;
  public admin_id: number;
  public title: string;
  public status: string;
  public messages: Message[];
  public user: User | undefined;
  public created_at: string | Date;
  public updated_at: string | Date;
  public no_unread_messages: number;
  public department: string;

  constructor(data: Ticket | void) {
    if(data === undefined)
    {
      this.id = 0;
      this.user_id = 0;
      this.admin_id = 0;
      this.title = '';
      this.status = '';
      this.messages = <Message[]>[];
      this.user = undefined;
      this.created_at = '';
      this.updated_at = '';
      this.no_unread_messages = 0;
      this.department = '';
    }
    else {
      this.id = data.id;
      this.user_id = data.user_id;
      this.admin_id = data.admin_id;
      this.title = data.title;
      this.status = data.status;
      this.messages = <Message[]>[];
      this.messages = data.messages;
      this.user = undefined;
      if(data.hasOwnProperty('user'))
      {
        this.user = new User(data.user);
      }
      this.no_unread_messages = 0;
      if(data.hasOwnProperty('messages'))
      {
        data.messages.forEach((message: Message) => {
          if(message.read === 0)
          {
            this.no_unread_messages++;
          }
        })
      }
      data.updated_at = new Date(data.updated_at);
      this.updated_at = data.updated_at.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      data.created_at = new Date(data.created_at);
      this.created_at = data.created_at.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      this.department = data.department;
    }
  }
}

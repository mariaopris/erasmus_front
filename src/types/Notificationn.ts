export class Notificationn {
  public id: number;
  public message: string;
  public created_at: Date | string;

  constructor(data: Notificationn | void) {
    if(data === undefined) {
      this.id = 0;
      this.message = '';
      this.created_at = '';
    }
    else {
      this.id = data.id;
      this.message = data.message;
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

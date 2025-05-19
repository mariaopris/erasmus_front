export class Feedback {
  public id: number;
  public recommendation_id: number;
  public score: number;
  public comment: string;
  public created_at: Date | string;

  constructor(data: Feedback | void) {
    if(data === undefined) {
      this.id = 0;
      this.recommendation_id = 0;
      this.score = 0;
      this.comment = '';
      this.created_at = '';
    }
    else {
      this.id = data.id;
      this.recommendation_id = data.recommendation_id;
      this.score = data.score;
      this.comment = data.comment;
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

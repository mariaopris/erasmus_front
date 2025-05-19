export class Language {
  public id: string;
  public name: string;

  constructor(data: any|void) {
    if(data === undefined) {
      this.id = '';
      this.name = '';
    }
    else {
      this.id = data.code;
      this.name = data.name;
    }
  }
}

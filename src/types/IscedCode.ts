export class IscedCode {
  public code: string;
  public name: string;

  constructor(data: IscedCode | void) {
    if(data === undefined) {
      this.code = '';
      this.name = '';
    }
    else {
      this.code = data.code;
      this.name = data.name;
    }
  }
}

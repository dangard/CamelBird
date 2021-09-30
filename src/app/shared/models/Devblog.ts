export class Devblog {

  constructor(
    // public id: any, TODO Handle ID
    public title: string,
    public body: string,
    public user: string
  ) {  }

  convertToJson () {
    return {
      title: this.title,
      body: this.body,
      user: this.user
    }
  }

}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DevblogService {
  devblogs = [
    {
      "id": 2,
      "title": "Dev Log  One",
      "body": "This  is my first devlog entry.",
      "date": "2021-09-25 12:28:19"
    },
    {
      "id": 3,
      "title": "Dev Log Two",
      "body": "This  is my two devlog entry.",
      "date": "2021-09-25 12:29:15"
    },
    {
      "id": 4,
      "title": "Dev Log Three",
      "body": "This  is my three devlog entry.",
      "date": "2021-09-25 12:29:25"
    },
    {
      "id": 5,
      "title": "Dev Log Four",
      "body": "This  is my fourth devlog entry.",
      "date": "2021-09-25 12:35:29"
    },
    {
      "id": 6,
      "title": "Dev Log Five",
      "body": "This  is my fifth devlog entry.",
      "date": "2021-09-25 12:38:48"
    },
    {
      "id": 7,
      "title": "Dev Log Six",
      "body": "This  is my sixth devlog entry.",
      "date": "2021-09-25 12:39:41"
    }
  ];

  constructor() {}

  public getDevBlogs(): Array < { id:number, title:string, body:string, date:string } > {
    return this.devblogs;
  }
  public createDevBlog(devBlog: { id:number, title:string, body:string, date:string }) {
    this.devblogs.push(devBlog);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConstants } from '../../../core/app.constants';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DevblogService {
  apiServerUrl: string = "";
  getDevLogsUrl: string = "";
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
  REST_API_SERVER: string = "http://localhost/devlog";


  constructor(private http: HttpClient, private constants: AppConstants) {
    this.apiServerUrl = environment.apiServerUrl;
    this.getDevLogsUrl = this.constants.OPERATIONS.DEVLOG.GET_ALL;
  }

  public getDevBlogs(){
    return this.http.get(this.REST_API_SERVER);
  }
  
  public createDevBlog(devBlog: { id:any, title:string, body:string, date:string }) {
    this.devblogs.push(devBlog);
  }
}

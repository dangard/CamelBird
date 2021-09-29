import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

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
  devblogs: any = [];
  REST_API_SERVER: string = environment.apiServerUrl;
  // 2021-09-25 12:38:48
  now = moment("").format("YYYY-MM-DD HH:MM:SS");


  constructor(private http: HttpClient, private constants: AppConstants) {
    this.apiServerUrl = environment.apiServerUrl;
    this.getDevLogsUrl = this.constants.OPERATIONS.DEVLOG.GET_ALL;
  }

  public getDevBlogs(){
    return this.http.get(this.REST_API_SERVER + this.constants.OPERATIONS.DEVLOG.GET_ALL);
  }
  
  public createDevBlog(devBlog: { id:any, title:string, body:string, date:string }) {
    this.devblogs.push(devBlog);
  }
}

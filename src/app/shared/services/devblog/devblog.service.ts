import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConstants } from '../../../core/app.constants';
import { environment } from '../../../../environments/environment';
import { EventListenerService } from '../common/event-listener.service';

@Injectable({
  providedIn: 'root'
})

export class DevblogService {
  apiServerUrl: string = "";
  getDevLogsUrl: string = "";
  devBlogs: any = [];
  REST_API_SERVER: string = environment.apiServerUrl;
  // 2021-09-25 12:38:48
  now = moment("").format("YYYY-MM-DD HH:MM:SS");
  errorMessage: string = "Ooops";
  postId: any;
  eventText: string = '';


  constructor(private http: HttpClient, private constants: AppConstants, private eventListenerService: EventListenerService) {
    this.apiServerUrl = environment.apiServerUrl;
    this.getDevLogsUrl = this.constants.OPERATIONS.DEVBLOG.GET_ALL;
  }

  public getDevBlogs() {
    let res = this.http.get(this.REST_API_SERVER + this.constants.OPERATIONS.DEVBLOG.GET_ALL);
    this.eventText = this.constants.EVENTS.DEVBLOG.READ;
    this.sendMessage();
    return res;
  }
  
  public createDevBlog(devBlog: { title:string, body:string, user:string }) {
    console.log(devBlog);
    this.http.post<any>(this.REST_API_SERVER + this.constants.OPERATIONS.DEVBLOG.CREATE, devBlog).subscribe({
        next: data => {
            this.postId = data.log_id;
            this.eventText = this.constants.EVENTS.DEVBLOG.CREATE;
            this.sendMessage();
        },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
    })
  }

  sendMessage(): void {
    this.eventListenerService.sendUpdate(this.eventText);
  }
}

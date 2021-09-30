import { Component, OnInit, OnDestroy  } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DevblogService } from '../../services/devblog/devblog.service';
import { EventListenerService } from '../../services/common/event-listener.service';
import { AppConstants } from '../../../core/app.constants';

import * as moment from 'moment';

@Component({
  selector: 'app-devblog-list',
  templateUrl: './devblog-list.component.html',
  styleUrls: ['./devblog-list.component.scss']
})
export class DevblogListComponent implements OnInit, OnDestroy {
  private eventListenerSubject: any;
  devBlogs: any;
  selectedDevBlog: any;
  event: any;
  errorMessage: any;

  constructor(private constants: AppConstants, public dataService: DevblogService, private eventListenerService: EventListenerService) {
    // subscribe to sender component messages
    this.eventListenerSubject = this.eventListenerService.getUpdate().subscribe({
      //message contains the data sent from service
      next: message => {
      this.event = message;
        if (this.event.text === this.constants.EVENTS.DEVBLOG.CREATE) {
          this.getGetDevBlogs();
        }
      },
      error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
      }
    });
  }

  ngOnInit() {
    this.getGetDevBlogs();
  }

  private getGetDevBlogs() {
    this.dataService.getDevBlogs().subscribe({
        next: resp => {
            this.devBlogs = resp;
        },
        error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
    });
  }

  public formatDate(date: string) {
    return moment(date).format('ddd, MMM Do YYYY');
  }

  public selectDevBlog(devBlog: any) {
    this.selectedDevBlog = devBlog;
  }

  ngOnDestroy() {
    this.eventListenerSubject.unsubscribe();
  }
}

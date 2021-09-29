import { Component, OnInit } from '@angular/core';
import { DevblogService } from '../../services/devblog/devblog.service';
import * as moment from 'moment';

@Component({
  selector: 'app-devblog-list',
  templateUrl: './devblog-list.component.html',
  styleUrls: ['./devblog-list.component.scss']
})
export class DevblogListComponent implements OnInit {
  devBlogs: any;
  selectedDevBlog: any;

  constructor(public dataService: DevblogService) { }

  ngOnInit() {
    this.dataService.getDevBlogs().subscribe(resp =>{
      this.devBlogs = resp;
    })  
  }

  public formatDate(date: string) {
    return moment(date).format('ddd, MMM Do YYYY');
  }

  public selectDevBlog(devBlog: any) {
    this.selectedDevBlog = devBlog;
  }
}

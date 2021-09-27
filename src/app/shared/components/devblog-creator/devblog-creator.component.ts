import { Component, OnInit } from '@angular/core';
import { DevblogService } from '../../services/devblog/devblog.service';

@Component({
  selector: 'app-devblog-creator',
  templateUrl: './devblog-creator.component.html',
  styleUrls: ['./devblog-creator.component.scss']
})
export class DevblogCreatorComponent implements OnInit {
  devBlog : {id: any, title: string, body: string, date: string} = {id: null, title: "", body: "", date: ""};

  constructor(public dataService: DevblogService) { }

  ngOnInit(): void {
  }

 createDevblog() {
    console.log(this.devBlog);
    this.dataService.createDevBlog(this.devBlog);
    this.devBlog = {id: null, title: "", body: "", date: ""};
  }
}

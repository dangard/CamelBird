import { Component, OnInit } from '@angular/core';
import { DevblogService } from '../../services/devblog/devblog.service';
import { Devblog } from '../../models/Devblog';

@Component({
  selector: 'app-devblog-creator',
  templateUrl: './devblog-creator.component.html',
  styleUrls: ['./devblog-creator.component.scss']
})
export class DevblogCreatorComponent implements OnInit {

  //TODO Handle Variation and Generation of GUID.
  devBlog = new Devblog("", "", "dangard");

  constructor(public dataService: DevblogService) { }

  ngOnInit(): void {
  }

  submitted = false;

  onSubmit() { this.submitted = true; }
  
  createDevblog() {
    this.dataService.createDevBlog(this.devBlog.convertToJson());
    this.devBlog = new Devblog("", "", "dangard");
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DevblogService } from '../../services/devblog/devblog.service';
import { Devblog } from '../../models/Devblog';

@Component({
  selector: 'app-devblog-creator',
  templateUrl: './devblog-creator.component.html',
  styleUrls: ['./devblog-creator.component.scss']
})
export class DevblogCreatorComponent implements OnInit {

  devBlog = new Devblog("", "", "dangard");

  devblogForm!: FormGroup;

  ngOnInit(): void {
    this.devblogForm = new FormGroup({
      title: new FormControl(this.devBlog.title, [
        Validators.required
      ]),
      body: new FormControl(this.devBlog.body, [
        Validators.required
      ])
    });
  }

  createDevblog() {
    let formData = this.devblogForm.value;
    this.devBlog = new Devblog(formData.title, formData.body, "dangard");
    this.dataService.createDevBlog(this.devBlog.convertToJson());
    this.devBlog = new Devblog("", "", "dangard");
  }

  get title() { return this.devblogForm.get('title')!; }

  get body() { return this.devblogForm.get('body')!; }

  constructor(public dataService: DevblogService) { }
}

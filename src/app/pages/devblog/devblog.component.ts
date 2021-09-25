import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../core/app.constants';

@Component({
  selector: 'app-devblog',
  templateUrl: './devblog.component.html',
  styleUrls: ['./devblog.component.scss']
})
export class DevblogComponent implements OnInit {
  createUrl;

  constructor(private constants: AppConstants) {
    this.createUrl = constants.OPERATIONS.DEVLOG.GET_ALL;
  }

  ngOnInit(): void {
  }

}

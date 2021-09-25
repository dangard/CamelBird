import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../core/app.constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-devblog',
  templateUrl: './devblog.component.html',
  styleUrls: ['./devblog.component.scss']
})
export class DevblogComponent implements OnInit {
  createUrl;
  apiServerUrl;

  constructor(private constants: AppConstants) {
    this.apiServerUrl = environment.apiServerUrl;
    this.createUrl = constants.OPERATIONS.DEVLOG.GET_ALL;
  }

  ngOnInit(): void {
  }

}

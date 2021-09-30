import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../core/app.constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-devblog',
  templateUrl: './devblog.component.html',
  styleUrls: ['./devblog.component.scss']
})
export class DevblogComponent implements OnInit {
  isCreateDevlogEnabled: boolean = false;

  constructor(private constants: AppConstants) { }

  ngOnInit(): void {
    this.isCreateDevlogEnabled = environment.enableDevlogCreate;
  }

}

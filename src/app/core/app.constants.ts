import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
    public OPERATIONS = {
      DEVBLOG: {
        GET_ALL: '/devlogs',
        GET: '/devlog',
        CREATE: '/devlog'
      }
    };
    public EVENTS = {
      DEVBLOG: {
        READ: 'DEVLOG_READ',
        CREATE:'DEVLOG_CREATED'
      }
    }
}
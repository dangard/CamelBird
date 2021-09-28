import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
    public OPERATIONS = {
      DEVLOG: {
        GET_ALL: "/devlog",
        GET: "/devlogs",
        CREATE: "/devlogs"
      }
    };
}
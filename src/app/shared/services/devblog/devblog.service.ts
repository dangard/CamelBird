import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import type { DevlogPublic } from "../../models/devblog-api.types";

@Injectable({
    providedIn: "root",
})
export class DevblogService {
    constructor(private http: HttpClient) {}

    public getDevBlogs(): Observable<DevlogPublic[]> {
        return this.http.get<DevlogPublic[]>(
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.DEVBLOG.GET_ALL,
        );
    }
}

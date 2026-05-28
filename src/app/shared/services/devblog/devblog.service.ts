import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import { EventListenerService } from "../common/event-listener.service";
import { Observable, tap } from "rxjs";
import type {
    CreateDevBlogResponse,
    DevBlogListPayload,
} from "../../models/devblog-api.types";

@Injectable({
    providedIn: "root",
})
export class DevblogService {
    constructor(
        private http: HttpClient,
        private eventListenerService: EventListenerService,
    ) {}

    public getDevBlogs(): Observable<DevBlogListPayload[]> {
        return this.http.get<DevBlogListPayload[]>(
            environment.apiServerUrl + APP_CONSTANTS.OPERATIONS.DEVBLOG.GET_ALL,
        );
    }

    public createDevBlog(devBlog: {
        title: string;
        body: string;
        user: string;
    }): Observable<CreateDevBlogResponse> {
        return this.http
            .post<CreateDevBlogResponse>(
                environment.apiServerUrl +
                    APP_CONSTANTS.OPERATIONS.DEVBLOG.CREATE,
                devBlog,
            )
            .pipe(
                tap({
                    next: () => {
                        this.eventListenerService.emit({
                            domain: "devblog",
                            type: "created",
                        });
                    },
                }),
            );
    }
}

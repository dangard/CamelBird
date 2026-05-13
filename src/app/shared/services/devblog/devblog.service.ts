import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AppConstants } from "../../../core/app.constants";
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
    apiServerUrl = "";
    getDevLogsUrl = "";
    devBlogs: DevBlogListPayload[] = [];
    REST_API_SERVER: string = environment.apiServerUrl;
    postId: string | undefined;

    constructor(
        private http: HttpClient,
        private constants: AppConstants,
        private eventListenerService: EventListenerService,
    ) {
        this.apiServerUrl = environment.apiServerUrl;
        this.getDevLogsUrl = this.constants.OPERATIONS.DEVBLOG.GET_ALL;
    }

    public getDevBlogs(): Observable<DevBlogListPayload[]> {
        return this.http.get<DevBlogListPayload[]>(
            this.REST_API_SERVER + this.constants.OPERATIONS.DEVBLOG.GET_ALL,
        );
    }

    public createDevBlog(devBlog: {
        title: string;
        body: string;
        user: string;
    }): Observable<CreateDevBlogResponse> {
        return this.http
            .post<CreateDevBlogResponse>(
                this.REST_API_SERVER + this.constants.OPERATIONS.DEVBLOG.CREATE,
                devBlog,
            )
            .pipe(
                tap({
                    next: (data) => {
                        this.postId = data.log_id;
                        this.eventListenerService.emit({
                            domain: "devblog",
                            type: "created",
                        });
                    },
                }),
            );
    }
}

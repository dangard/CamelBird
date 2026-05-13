import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AppConstants } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import { EventListenerService } from "../common/event-listener.service";
import { Observable } from "rxjs";
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
    errorMessage = "Ooops";
    postId: string | undefined;
    eventText = "";

    constructor(
        private http: HttpClient,
        private constants: AppConstants,
        private eventListenerService: EventListenerService,
    ) {
        this.apiServerUrl = environment.apiServerUrl;
        this.getDevLogsUrl = this.constants.OPERATIONS.DEVBLOG.GET_ALL;
    }

    public getDevBlogs(): Observable<DevBlogListPayload[]> {
        const res = this.http.get<DevBlogListPayload[]>(
            this.REST_API_SERVER + this.constants.OPERATIONS.DEVBLOG.GET_ALL,
        );
        this.eventText = this.constants.EVENTS.DEVBLOG.READ;
        this.sendMessage();
        return res;
    }

    public createDevBlog(devBlog: {
        title: string;
        body: string;
        user: string;
    }) {
        this.http
            .post<CreateDevBlogResponse>(
                this.REST_API_SERVER + this.constants.OPERATIONS.DEVBLOG.CREATE,
                devBlog,
            )
            .subscribe({
                next: (data) => {
                    this.postId = data.log_id;
                    this.eventText = this.constants.EVENTS.DEVBLOG.CREATE;
                    this.sendMessage();
                },
                error: (error) => {
                    this.errorMessage = error.message;
                    console.error("There was an error!", error);
                },
            });
    }

    sendMessage(): void {
        this.eventListenerService.sendUpdate(this.eventText);
    }
}

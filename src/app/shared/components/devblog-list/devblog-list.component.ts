import { DestroyRef, inject, Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DevblogService } from "../../services/devblog/devblog.service";
import { EventListenerService } from "../../services/common/event-listener.service";
import { AppConstants } from "../../../core/app.constants";

import { format, isValid, parseISO } from "date-fns";
import { NgIf, NgFor } from "@angular/common";

@Component({
    selector: "app-devblog-list",
    standalone: true,
    templateUrl: "./devblog-list.component.html",
    styleUrls: ["./devblog-list.component.scss"],
    imports: [NgIf, NgFor],
})
export class DevblogListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    devBlogs: any;
    selectedDevBlog: any;
    event: any;
    errorMessage: any;
    loading = true;

    constructor(
        private constants: AppConstants,
        public dataService: DevblogService,
        private eventListenerService: EventListenerService,
    ) {
        // subscribe to sender component messages
        this.eventListenerService
            .getUpdate()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                //message contains the data sent from service
                next: (message) => {
                    this.event = message;
                    if (
                        this.event.text === this.constants.EVENTS.DEVBLOG.CREATE
                    )
                        this.getGetDevBlogs();
                },
                error: (error) => {
                    this.errorMessage = error.message;
                    console.error("There was an error!", error);
                },
            });
    }

    ngOnInit() {
        this.getGetDevBlogs();
    }

    private getGetDevBlogs() {
        this.dataService.getDevBlogs().subscribe({
            next: (resp) => {
                this.loading = true;
                this.devBlogs = resp;
                this.loading = false;
            },
            error: (error) => {
                this.errorMessage = error.message;
                console.error("There was an error!", error);
            },
        });
    }

    public formatDate(date: string) {
        let d = parseISO(date);
        if (!isValid(d)) {
            const fallback = new Date(date);
            d = fallback;
        }
        return isValid(d) ? format(d, "EEE, MMM do yyyy") : date;
    }

    public selectDevBlog(devBlog: any) {
        this.selectedDevBlog = devBlog;
    }
}

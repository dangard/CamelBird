import { DestroyRef, inject, Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";

import { DevblogService } from "../../services/devblog/devblog.service";
import { EventListenerService } from "../../services/common/event-listener.service";

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
    errorMessage: any;
    loading = true;

    constructor(
        public dataService: DevblogService,
        private eventListenerService: EventListenerService,
    ) {
        this.eventListenerService.events$
            .pipe(
                filter((e) => e.domain === "devblog" && e.type === "created"),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => this.getGetDevBlogs(),
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

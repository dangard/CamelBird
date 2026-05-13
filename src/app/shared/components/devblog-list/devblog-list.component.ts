import { HttpErrorResponse } from "@angular/common/http";
import { DestroyRef, inject, Component, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";

import { LoggerService } from "../../../core/logger.service";
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
    private readonly logger = inject(LoggerService);

    devBlogs: any;
    selectedDevBlog: any;
    errorMessage: string | null = null;
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
                error: (error: unknown) => {
                    const message =
                        error instanceof Error ? error.message : String(error);
                    this.errorMessage = message;
                    this.logger.error("Dev blog event stream error", {
                        message,
                    });
                },
            });
    }

    ngOnInit() {
        this.getGetDevBlogs();
    }

    private getGetDevBlogs() {
        this.loading = true;
        this.errorMessage = null;
        this.dataService.getDevBlogs().subscribe({
            next: (resp) => {
                this.devBlogs = resp;
                this.loading = false;
            },
            error: (error: unknown) => {
                const message =
                    error instanceof HttpErrorResponse
                        ? error.message ||
                          `Could not load dev blogs (${error.status}). Try again later.`
                        : error instanceof Error
                          ? error.message
                          : "Could not load dev blogs. Try again later.";
                this.errorMessage = message;
                this.loading = false;
                this.logger.error("Dev blog list load failed", {
                    message,
                });
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

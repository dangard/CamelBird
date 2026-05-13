import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { DevblogService } from "../../services/devblog/devblog.service";
import { Devblog } from "../../models/Devblog";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-devblog-creator",
    standalone: true,
    templateUrl: "./devblog-creator.component.html",
    styleUrls: ["./devblog-creator.component.scss"],
    imports: [FormsModule, ReactiveFormsModule, NgIf],
})
export class DevblogCreatorComponent implements OnInit {
    devBlog = new Devblog("", "", "dangard");

    devblogForm!: UntypedFormGroup;

    /** User-visible failure after POST (HTTP errors are also logged globally). */
    submitError: string | null = null;

    ngOnInit(): void {
        this.devblogForm = new UntypedFormGroup({
            title: new UntypedFormControl(this.devBlog.title, [
                Validators.required,
            ]),
            body: new UntypedFormControl(this.devBlog.body, [
                Validators.required,
            ]),
        });
    }

    createDevblog() {
        if (this.devblogForm.invalid) return;

        this.submitError = null;
        const formData = this.devblogForm.value;
        this.devBlog = new Devblog(formData.title, formData.body, "dangard");
        this.dataService.createDevBlog(this.devBlog.convertToJson()).subscribe({
            next: () => {
                this.devblogForm.reset({ title: "", body: "" });
            },
            error: (err: HttpErrorResponse) => {
                const body = err.error;
                const fromApi =
                    body &&
                    typeof body === "object" &&
                    "message" in body &&
                    typeof (body as { message: unknown }).message === "string"
                        ? (body as { message: string }).message
                        : null;
                this.submitError =
                    fromApi ??
                    err.message ??
                    `Could not publish (${err.status}). Try again later.`;
            },
        });
    }

    get title() {
        return this.devblogForm.get("title")!;
    }

    get body() {
        return this.devblogForm.get("body")!;
    }

    constructor(public dataService: DevblogService) {}
}

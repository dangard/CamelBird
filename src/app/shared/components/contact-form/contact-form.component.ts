import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgFor, NgIf } from "@angular/common";

import {
    CONTACT_SUBJECTS,
    type ContactSubject,
} from "../../models/contact-api.types";
import { ContactService } from "../../services/contact/contact.service";

const SUBJECT_QUERY_MAP: Record<string, ContactSubject> = {
    "resume-request": "Resume Request",
    "general-question": "General Question",
    "saying-hello": "Saying Hello",
};

@Component({
    selector: "app-contact-form",
    standalone: true,
    templateUrl: "./contact-form.component.html",
    styleUrls: ["./contact-form.component.scss"],
    imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
})
export class ContactFormComponent implements OnInit {
    readonly subjects = CONTACT_SUBJECTS;

    contactForm!: UntypedFormGroup;
    submitError: string | null = null;
    submitted = false;

    constructor(
        private contactService: ContactService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const initialSubject = this.resolveInitialSubject();

        this.contactForm = new UntypedFormGroup({
            subject: new UntypedFormControl(initialSubject, [
                Validators.required,
            ]),
            name: new UntypedFormControl("", [Validators.required]),
            email: new UntypedFormControl("", [
                Validators.required,
                Validators.email,
            ]),
            message: new UntypedFormControl("", [Validators.required]),
            website: new UntypedFormControl(""),
        });
    }

    sendContact(): void {
        if (this.contactForm.invalid) return;

        this.submitError = null;
        const formData = this.contactForm.value;

        this.contactService
            .sendContact({
                subject: formData.subject,
                name: formData.name,
                email: formData.email,
                message: formData.message,
                website: formData.website ?? "",
            })
            .subscribe({
                next: () => {
                    this.submitted = true;
                },
                error: (err: HttpErrorResponse) => {
                    const body = err.error;
                    const fromApi =
                        body &&
                        typeof body === "object" &&
                        "message" in body &&
                        typeof (body as { message: unknown }).message ===
                            "string"
                            ? (body as { message: string }).message
                            : null;

                    if (err.status === 0) {
                        this.submitError =
                            "We couldn't reach the server. Check your connection and try again.";
                        return;
                    }

                    if (err.status === 429) {
                        this.submitError =
                            fromApi ??
                            "Too many requests. Please try again later.";
                        return;
                    }

                    this.submitError =
                        fromApi ??
                        err.message ??
                        `Could not send your message (${err.status}). Try again later.`;
                },
            });
    }

    resetForm(): void {
        this.submitted = false;
        this.submitError = null;
        this.contactForm.reset({
            subject: "General Question",
            name: "",
            email: "",
            message: "",
            website: "",
        });
    }

    get subject() {
        return this.contactForm.get("subject")!;
    }

    get name() {
        return this.contactForm.get("name")!;
    }

    get email() {
        return this.contactForm.get("email")!;
    }

    get message() {
        return this.contactForm.get("message")!;
    }

    private resolveInitialSubject(): ContactSubject {
        const querySubject = this.route.snapshot.queryParamMap
            .get("subject")
            ?.toLowerCase();

        if (querySubject && SUBJECT_QUERY_MAP[querySubject])
            return SUBJECT_QUERY_MAP[querySubject];

        return "General Question";
    }
}

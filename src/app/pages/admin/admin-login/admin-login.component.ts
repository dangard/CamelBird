import { NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ADMIN_ROUTES } from "../../../core/auth.constants";
import { ApiErrorMapperService } from "../../../shared/services/auth/api-error-mapper.service";
import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
    selector: "app-admin-login",
    standalone: true,
    imports: [ReactiveFormsModule, NgIf],
    templateUrl: "./admin-login.component.html",
    styleUrls: ["./admin-login.component.scss"],
})
export class AdminLoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly errors = inject(ApiErrorMapperService);

    submitting = false;
    submitError: string | null = null;

    form = new FormGroup({
        username: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        password: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    submit(): void {
        if (this.form.invalid || this.submitting) return;

        this.submitting = true;
        this.submitError = null;

        this.auth.login(this.form.getRawValue()).subscribe({
            next: () => {
                this.submitting = false;
                const returnUrl =
                    this.route.snapshot.queryParamMap.get("returnUrl") ||
                    ADMIN_ROUTES.DASHBOARD;
                void this.router.navigateByUrl(returnUrl);
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.submitError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Invalid credentials")
                        : "Invalid credentials";
            },
        });
    }
}

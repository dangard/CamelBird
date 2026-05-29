import { NgFor, NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject, OnInit } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";

import { can } from "../../../core/auth/role-capabilities";
import type { StaffRole } from "../../../shared/models/auth-api.types";
import type {
    UserPatchRequest,
    UserRecord,
} from "../../../shared/models/user-api.types";
import { ApiErrorMapperService } from "../../../shared/services/auth/api-error-mapper.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { UsersAdminService } from "../../../shared/services/users/users-admin.service";
import { CrudListPanelComponent } from "../../../shared/components/crud-list-panel/crud-list-panel.component";

@Component({
    selector: "app-admin-users",
    standalone: true,
    imports: [NgIf, NgFor, ReactiveFormsModule, CrudListPanelComponent],
    templateUrl: "./admin-users.component.html",
    styleUrls: ["./admin-users.component.scss"],
})
export class AdminUsersComponent implements OnInit {
    private readonly usersService = inject(UsersAdminService);
    private readonly auth = inject(AuthService);
    private readonly errors = inject(ApiErrorMapperService);

    users: UserRecord[] = [];
    loading = true;
    errorMessage: string | null = null;
    formError: string | null = null;
    fieldErrors: Record<string, string> = {};
    submitting = false;
    editingId: number | null = null;

    createForm = new FormGroup({
        username: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        email: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        password: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(8)],
        }),
        first_name: new FormControl("", { nonNullable: true }),
        last_name: new FormControl("", { nonNullable: true }),
        role: new FormControl<StaffRole>("read_only", { nonNullable: true }),
    });

    editForm = new FormGroup({
        email: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        password: new FormControl("", {
            nonNullable: true,
            validators: [AdminUsersComponent.optionalPassword],
        }),
        first_name: new FormControl("", { nonNullable: true }),
        last_name: new FormControl("", { nonNullable: true }),
        role: new FormControl<StaffRole>("read_only", { nonNullable: true }),
        is_active: new FormControl(true, { nonNullable: true }),
    });

    get role(): StaffRole | null {
        return this.auth.getCurrentUser()?.role ?? null;
    }

    get canCreate(): boolean {
        return can(this.role, "users.create");
    }

    get canPatch(): boolean {
        return can(this.role, "users.patch");
    }

    /** Admin-only fields (password, role, is_active) per API contract. */
    get isAdmin(): boolean {
        return this.role === "admin";
    }

    private static optionalPassword(
        control: FormControl<string>,
    ): { minlength: { requiredLength: number; actualLength: number } } | null {
        const value = control.value.trim();
        if (!value) return null;
        return value.length >= 8
            ? null
            : { minlength: { requiredLength: 8, actualLength: value.length } };
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.errorMessage = null;
        this.usersService.list().subscribe({
            next: (rows) => {
                this.users = rows;
                this.loading = false;
            },
            error: (err: unknown) => {
                this.loading = false;
                this.errorMessage =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not load users")
                        : "Could not load users";
            },
        });
    }

    createUser(): void {
        if (!this.canCreate || this.createForm.invalid || this.submitting)
            return;

        this.submitting = true;
        this.formError = null;
        this.fieldErrors = {};

        this.usersService.create(this.createForm.getRawValue()).subscribe({
            next: () => {
                this.submitting = false;
                this.createForm.reset({
                    username: "",
                    email: "",
                    password: "",
                    first_name: "",
                    last_name: "",
                    role: "read_only",
                });
                this.loadUsers();
            },
            error: (err: unknown) => {
                this.submitting = false;
                if (err instanceof HttpErrorResponse) {
                    this.formError = this.errors.mapError(
                        err,
                        "Could not create user",
                    );
                    this.fieldErrors = this.errors.fieldErrors(err);
                } else {
                    this.formError = "Could not create user";
                }
            },
        });
    }

    startEdit(user: UserRecord): void {
        if (!this.canPatch) return;
        this.editingId = user.id;
        this.editForm.reset({
            email: user.email,
            password: "",
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active,
        });
        this.formError = null;
        this.fieldErrors = {};
    }

    cancelEdit(): void {
        this.editingId = null;
    }

    saveEdit(): void {
        if (
            !this.canPatch ||
            this.editingId === null ||
            this.editForm.invalid ||
            this.submitting
        )
            return;

        this.submitting = true;
        this.formError = null;
        this.fieldErrors = {};

        const { password, role, is_active, ...fields } =
            this.editForm.getRawValue();
        const payload: UserPatchRequest = { ...fields };
        if (this.isAdmin) {
            payload.role = role;
            payload.is_active = is_active;
            const nextPassword = password.trim();
            if (nextPassword) payload.password = nextPassword;
        }

        this.usersService.patch(this.editingId, payload).subscribe({
                next: () => {
                    this.submitting = false;
                    this.editingId = null;
                    this.loadUsers();
                },
                error: (err: unknown) => {
                    this.submitting = false;
                    if (err instanceof HttpErrorResponse) {
                        this.formError = this.errors.mapError(
                            err,
                            "Could not update user",
                        );
                        this.fieldErrors = this.errors.fieldErrors(err);
                    } else {
                        this.formError = "Could not update user";
                    }
                },
            });
    }

    deactivate(user: UserRecord): void {
        if (!this.canPatch || this.submitting) return;

        this.submitting = true;
        this.usersService.patch(user.id, { is_active: false }).subscribe({
            next: () => {
                this.submitting = false;
                this.loadUsers();
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.formError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not deactivate user")
                        : "Could not deactivate user";
            },
        });
    }
}

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
import { AdminFormModalComponent } from "../../../shared/components/admin-form-modal/admin-form-modal.component";
import { AdminPageHeaderComponent } from "../../../shared/components/admin-page-header/admin-page-header.component";
import type { StaffRole } from "../../../shared/models/auth-api.types";
import type {
    UserPatchRequest,
    UserRecord,
} from "../../../shared/models/user-api.types";
import { ApiErrorMapperService } from "../../../shared/services/auth/api-error-mapper.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { UsersAdminService } from "../../../shared/services/users/users-admin.service";
import { CrudListPanelComponent } from "../../../shared/components/crud-list-panel/crud-list-panel.component";
import { optionalPasswordValidator } from "../../../shared/utils/form-validators";
import {
    hasRecordChanges,
    replaceInList,
} from "../../../shared/utils/list-utils";

interface EditUserBaseline {
    email: string;
    first_name: string;
    last_name: string;
    role: StaffRole;
    is_active: boolean;
}

@Component({
    selector: "app-admin-users",
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ReactiveFormsModule,
        CrudListPanelComponent,
        AdminPageHeaderComponent,
        AdminFormModalComponent,
    ],
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
    createFormError: string | null = null;
    editFormError: string | null = null;
    actionError: string | null = null;
    submitting = false;
    createModalOpen = false;
    editingUser: UserRecord | null = null;
    private editBaseline: EditUserBaseline | null = null;

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
            validators: [optionalPasswordValidator],
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

    get isAdmin(): boolean {
        return this.role === "admin";
    }

    get editHasChanges(): boolean {
        const raw = this.editForm.getRawValue();
        return hasRecordChanges(
            this.editBaseline,
            {
                email: raw.email,
                first_name: raw.first_name,
                last_name: raw.last_name,
                role: raw.role,
                is_active: raw.is_active,
            },
            ["email", "first_name", "last_name", "role", "is_active"],
            () => raw.password.trim().length > 0,
        );
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

    openCreateModal(): void {
        if (!this.canCreate) return;

        this.createModalOpen = true;
        this.createFormError = null;
        this.createForm.reset({
            username: "",
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            role: "read_only",
        });
    }

    closeCreateModal(): void {
        this.createModalOpen = false;
        this.createFormError = null;
    }

    createUser(): void {
        if (
            !this.canCreate ||
            !this.createModalOpen ||
            this.createForm.invalid ||
            this.submitting
        )
            return;

        this.submitting = true;
        this.createFormError = null;

        this.usersService.create(this.createForm.getRawValue()).subscribe({
            next: (created) => {
                this.submitting = false;
                this.users = [...this.users, created];
                this.closeCreateModal();
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.createFormError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not create user")
                        : "Could not create user";
            },
        });
    }

    openEditModal(user: UserRecord): void {
        if (!this.canPatch) return;

        this.editingUser = user;
        this.editBaseline = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active,
        };
        this.editForm.reset({
            email: user.email,
            password: "",
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active,
        });
        this.editFormError = null;
    }

    closeEditModal(): void {
        this.editingUser = null;
        this.editBaseline = null;
        this.editFormError = null;
    }

    saveEdit(): void {
        if (
            !this.canPatch ||
            !this.editingUser ||
            this.editForm.invalid ||
            !this.editHasChanges ||
            this.submitting
        )
            return;

        const userId = this.editingUser.id;
        this.submitting = true;
        this.editFormError = null;

        const { password, role, is_active, ...fields } =
            this.editForm.getRawValue();
        const payload: UserPatchRequest = { ...fields };
        if (this.isAdmin) {
            payload.role = role;
            payload.is_active = is_active;
            const nextPassword = password.trim();
            if (nextPassword) payload.password = nextPassword;
        }

        this.usersService.patch(userId, payload).subscribe({
            next: (updated) => {
                this.submitting = false;
                this.users = replaceInList(this.users, updated);
                this.closeEditModal();
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.editFormError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not update user")
                        : "Could not update user";
            },
        });
    }

    deactivate(user: UserRecord): void {
        if (!this.canPatch || this.submitting) return;

        this.submitting = true;
        this.actionError = null;
        this.usersService.patch(user.id, { is_active: false }).subscribe({
            next: (updated) => {
                this.submitting = false;
                this.users = replaceInList(this.users, updated);
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.actionError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not deactivate user")
                        : "Could not deactivate user";
            },
        });
    }
}

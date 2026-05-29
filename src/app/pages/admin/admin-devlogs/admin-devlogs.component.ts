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
import type { DevBlogListItem } from "../../../shared/models/devblog-api.types";
import type { StaffRole } from "../../../shared/models/auth-api.types";
import { ApiErrorMapperService } from "../../../shared/services/auth/api-error-mapper.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { DevblogAdminService } from "../../../shared/services/devblog/devblog-admin.service";
import { CrudListPanelComponent } from "../../../shared/components/crud-list-panel/crud-list-panel.component";

@Component({
    selector: "app-admin-devlogs",
    standalone: true,
    imports: [NgIf, NgFor, ReactiveFormsModule, CrudListPanelComponent],
    templateUrl: "./admin-devlogs.component.html",
    styleUrls: ["./admin-devlogs.component.scss"],
})
export class AdminDevlogsComponent implements OnInit {
    private readonly devlogsService = inject(DevblogAdminService);
    private readonly auth = inject(AuthService);
    private readonly errors = inject(ApiErrorMapperService);

    devlogs: DevBlogListItem[] = [];
    loading = true;
    errorMessage: string | null = null;
    formError: string | null = null;
    submitting = false;
    editingId: string | null = null;

    createForm = new FormGroup({
        title: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        body: new FormControl("", { nonNullable: true }),
        user: new FormControl("", { nonNullable: true }),
    });

    editForm = new FormGroup({
        title: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        body: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        is_published: new FormControl(true, { nonNullable: true }),
    });

    get role(): StaffRole | null {
        return this.auth.getCurrentUser()?.role ?? null;
    }

    get canCreate(): boolean {
        return can(this.role, "devlogs.create");
    }

    get canPatch(): boolean {
        return can(this.role, "devlogs.patch");
    }

    get canDelete(): boolean {
        return can(this.role, "devlogs.delete");
    }

    ngOnInit(): void {
        this.loadDevlogs();
        const user = this.auth.getCurrentUser();
        if (user?.username) this.createForm.patchValue({ user: user.username });
    }

    loadDevlogs(): void {
        this.loading = true;
        this.errorMessage = null;
        this.devlogsService.list().subscribe({
            next: (rows) => {
                this.devlogs = rows;
                this.loading = false;
            },
            error: (err: unknown) => {
                this.loading = false;
                this.errorMessage =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not load devlogs")
                        : "Could not load devlogs";
            },
        });
    }

    createDevlog(): void {
        if (!this.canCreate || this.createForm.invalid || this.submitting)
            return;

        this.submitting = true;
        this.formError = null;

        this.devlogsService.create(this.createForm.getRawValue()).subscribe({
            next: () => {
                this.submitting = false;
                this.createForm.patchValue({ title: "", body: "" });
                this.loadDevlogs();
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.formError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not create devlog")
                        : "Could not create devlog";
            },
        });
    }

    startEdit(entry: DevBlogListItem): void {
        if (!this.canPatch) return;
        this.editingId = entry.id;
        this.editForm.patchValue({
            title: entry.title,
            body: entry.body,
            is_published: entry.is_published,
        });
        this.formError = null;
    }

    cancelEdit(): void {
        this.editingId = null;
    }

    saveEdit(): void {
        if (
            !this.canPatch ||
            !this.editingId ||
            this.editForm.invalid ||
            this.submitting
        )
            return;

        this.submitting = true;
        this.formError = null;

        this.devlogsService
            .patch(this.editingId, this.editForm.getRawValue())
            .subscribe({
                next: () => {
                    this.submitting = false;
                    this.editingId = null;
                    this.loadDevlogs();
                },
                error: (err: unknown) => {
                    this.submitting = false;
                    this.formError =
                        err instanceof HttpErrorResponse
                            ? this.errors.mapError(
                                  err,
                                  "Could not update devlog",
                              )
                            : "Could not update devlog";
                },
            });
    }

    deleteDevlog(entry: DevBlogListItem): void {
        if (!this.canDelete || this.submitting) return;

        this.submitting = true;
        this.devlogsService.delete(entry.id).subscribe({
            next: () => {
                this.submitting = false;
                if (this.editingId === entry.id) this.editingId = null;

                this.loadDevlogs();
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.formError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not delete devlog")
                        : "Could not delete devlog";
            },
        });
    }
}

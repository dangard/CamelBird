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
import type { DevBlogListItem } from "../../../shared/models/devblog-api.types";
import type { StaffRole } from "../../../shared/models/auth-api.types";
import { ApiErrorMapperService } from "../../../shared/services/auth/api-error-mapper.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { DevblogAdminService } from "../../../shared/services/devblog/devblog-admin.service";
import { CrudListPanelComponent } from "../../../shared/components/crud-list-panel/crud-list-panel.component";
import {
    hasRecordChanges,
    replaceInList,
} from "../../../shared/utils/list-utils";

interface EditDevlogBaseline {
    title: string;
    body: string;
    is_published: boolean;
}

@Component({
    selector: "app-admin-devlogs",
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        ReactiveFormsModule,
        CrudListPanelComponent,
        AdminPageHeaderComponent,
        AdminFormModalComponent,
    ],
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
    createFormError: string | null = null;
    editFormError: string | null = null;
    actionError: string | null = null;
    submitting = false;
    createModalOpen = false;
    editingEntry: DevBlogListItem | null = null;
    private editBaseline: EditDevlogBaseline | null = null;

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

    get editHasChanges(): boolean {
        const raw = this.editForm.getRawValue();
        return hasRecordChanges(this.editBaseline, raw, [
            "title",
            "body",
            "is_published",
        ]);
    }

    ngOnInit(): void {
        this.loadDevlogs();
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

    openCreateModal(): void {
        if (!this.canCreate) return;

        this.createModalOpen = true;
        this.createFormError = null;
        const username = this.auth.getCurrentUser()?.username ?? "";
        this.createForm.reset({
            title: "",
            body: "",
            user: username,
        });
    }

    closeCreateModal(): void {
        this.createModalOpen = false;
        this.createFormError = null;
    }

    createDevlog(): void {
        if (
            !this.canCreate ||
            !this.createModalOpen ||
            this.createForm.invalid ||
            this.submitting
        )
            return;

        this.submitting = true;
        this.createFormError = null;

        this.devlogsService.create(this.createForm.getRawValue()).subscribe({
            next: () => {
                this.submitting = false;
                this.closeCreateModal();
                this.syncDevlogs();
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.createFormError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not create devlog")
                        : "Could not create devlog";
            },
        });
    }

    openEditModal(entry: DevBlogListItem): void {
        if (!this.canPatch) return;

        this.editingEntry = entry;
        this.editBaseline = {
            title: entry.title,
            body: entry.body,
            is_published: entry.is_published,
        };
        this.editForm.reset({
            title: entry.title,
            body: entry.body,
            is_published: entry.is_published,
        });
        this.editFormError = null;
    }

    closeEditModal(): void {
        this.editingEntry = null;
        this.editBaseline = null;
        this.editFormError = null;
    }

    saveEdit(): void {
        if (
            !this.canPatch ||
            !this.editingEntry ||
            this.editForm.invalid ||
            !this.editHasChanges ||
            this.submitting
        )
            return;

        const entryId = this.editingEntry.id;
        this.submitting = true;
        this.editFormError = null;

        this.devlogsService
            .patch(entryId, this.editForm.getRawValue())
            .subscribe({
                next: (updated) => {
                    this.submitting = false;
                    this.devlogs = replaceInList(this.devlogs, updated);
                    this.closeEditModal();
                },
                error: (err: unknown) => {
                    this.submitting = false;
                    this.editFormError =
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

        if (
            !window.confirm(
                `Delete devlog "${entry.title}"? This cannot be undone.`,
            )
        ) {
            return;
        }

        this.submitting = true;
        this.actionError = null;
        this.devlogsService.delete(entry.id).subscribe({
            next: () => {
                this.submitting = false;
                if (this.editingEntry?.id === entry.id) this.closeEditModal();
                this.devlogs = this.devlogs.filter(
                    (row) => row.id !== entry.id,
                );
            },
            error: (err: unknown) => {
                this.submitting = false;
                this.actionError =
                    err instanceof HttpErrorResponse
                        ? this.errors.mapError(err, "Could not delete devlog")
                        : "Could not delete devlog";
            },
        });
    }

    private syncDevlogs(): void {
        this.devlogsService.list().subscribe({
            next: (rows) => {
                this.devlogs = rows;
            },
            error: () => {
                // Keep list as-is; create succeeded.
            },
        });
    }
}

import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { STAFF_DEVLOG_REQUEST } from "../../../core/auth/auth-http.context";
import { environment } from "../../../../environments/environment";
import type {
    CreateDevBlogResponse,
    DevBlogCreateRequest,
    DevBlogListItem,
    DevBlogPatchRequest,
    DevlogStaff,
} from "../../models/devblog-api.types";

@Injectable({ providedIn: "root" })
export class DevblogAdminService {
    private readonly http = inject(HttpClient);

    private base(path: string): string {
        return environment.apiUrl + path;
    }

    list(): Observable<DevBlogListItem[]> {
        return this.http.get<DevBlogListItem[]>(
            this.base(APP_CONSTANTS.OPERATIONS.DEVBLOG.GET_ALL),
            {
                context: new HttpContext().set(STAFF_DEVLOG_REQUEST, true),
            },
        );
    }

    create(payload: DevBlogCreateRequest): Observable<CreateDevBlogResponse> {
        return this.http.post<CreateDevBlogResponse>(
            this.base(APP_CONSTANTS.OPERATIONS.DEVBLOG.GET_ALL),
            payload,
        );
    }

    patch(id: string, payload: DevBlogPatchRequest): Observable<DevlogStaff> {
        return this.http.patch<DevlogStaff>(
            this.base(APP_CONSTANTS.OPERATIONS.DEVBLOG.BY_ID(id)),
            payload,
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(
            this.base(APP_CONSTANTS.OPERATIONS.DEVBLOG.BY_ID(id)),
        );
    }
}

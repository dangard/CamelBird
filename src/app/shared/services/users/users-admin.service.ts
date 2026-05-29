import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import type {
    UserCreateRequest,
    UserPatchRequest,
    UserRecord,
} from "../../models/user-api.types";

@Injectable({ providedIn: "root" })
export class UsersAdminService {
    private readonly http = inject(HttpClient);

    private base(path: string): string {
        return environment.apiUrl + path;
    }

    list(): Observable<UserRecord[]> {
        return this.http.get<UserRecord[]>(
            this.base(APP_CONSTANTS.OPERATIONS.USERS.LIST),
        );
    }

    get(id: number): Observable<UserRecord> {
        return this.http.get<UserRecord>(
            this.base(APP_CONSTANTS.OPERATIONS.USERS.BY_ID(id)),
        );
    }

    create(payload: UserCreateRequest): Observable<UserRecord> {
        return this.http.post<UserRecord>(
            this.base(APP_CONSTANTS.OPERATIONS.USERS.LIST),
            payload,
        );
    }

    patch(id: number, payload: UserPatchRequest): Observable<UserRecord> {
        return this.http.patch<UserRecord>(
            this.base(APP_CONSTANTS.OPERATIONS.USERS.BY_ID(id)),
            payload,
        );
    }
}

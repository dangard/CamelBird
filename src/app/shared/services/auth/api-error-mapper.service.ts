import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HTTP_STATUS } from "../../../core/auth.constants";
import { environment } from "../../../../environments/environment";
import type { ApiErrorBody } from "../../models/auth-api.types";

@Injectable({ providedIn: "root" })
export class ApiErrorMapperService {
    mapError(err: HttpErrorResponse, fallback = "Request failed"): string {
        if (err.status === 0) {
            const api = environment.apiUrl;
            return (
                `Could not reach the API at ${api}. ` +
                "Check DevTools → Network → Request Headers → Origin: it must match an entry in the API CORS_ALLOW_ORIGIN exactly (including www vs non-www, http vs https)."
            );
        }

        const body = err.error as ApiErrorBody | null;
        if (
            body &&
            typeof body.message === "string" &&
            body.message.trim() !== ""
        )
            return body.message;

        if (err.status === HTTP_STATUS.TOO_MANY_REQUESTS)
            return "Too many requests. Please wait and try again.";

        if (err.status >= 500) return "Server error. Try again later.";

        return fallback;
    }

    fieldErrors(err: HttpErrorResponse): Record<string, string> {
        const body = err.error as ApiErrorBody | null;
        return body?.errors ?? {};
    }
}

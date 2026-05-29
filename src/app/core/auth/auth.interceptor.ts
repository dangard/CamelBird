import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { AuthService } from "../../shared/services/auth/auth.service";
import {
    STAFF_DEVLOG_REQUEST,
    apiPath,
    isDevlogMutation,
    isStaffDevlogList,
} from "./auth-http.context";

function shouldAttachBearer(
    path: string,
    method: string,
    staffDevlogRequest: boolean,
): boolean {
    if (path.startsWith("/users") || path === "/auth/refresh") return true;
    if (isDevlogMutation(path, method)) return true;
    if (isStaffDevlogList(path, method, staffDevlogRequest)) return true;
    return false;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const path = apiPath(req.url);
    if (
        path === null ||
        !shouldAttachBearer(
            path,
            req.method,
            req.context.get(STAFF_DEVLOG_REQUEST),
        )
    )
        return next(req);

    const auth = inject(AuthService);
    const token = auth.getAccessToken();
    if (!token) return next(req);

    return next(
        req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        }),
    );
};

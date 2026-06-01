import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";

import { HTTP_STATUS } from "../auth.constants";
import { AuthService } from "../../shared/services/auth/auth.service";
import {
    STAFF_DEVLOG_REQUEST,
    apiPath,
    isDevlogMutation,
    isStaffDevlogList,
} from "./auth-http.context";

function shouldRetryOnUnauthorized(
    path: string,
    method: string,
    staffDevlogRequest: boolean,
): boolean {
    if (path.startsWith("/users")) return true;
    if (isDevlogMutation(path, method)) return true;
    if (isStaffDevlogList(path, method, staffDevlogRequest)) return true;
    return path === "/auth/refresh";
}

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const path = apiPath(req.url);

    return next(req).pipe(
        catchError((err: unknown) => {
            if (!(err instanceof HttpErrorResponse))
                return throwError(() => err);

            if (
                err.status !== HTTP_STATUS.UNAUTHORIZED ||
                path === null ||
                !shouldRetryOnUnauthorized(
                    path,
                    req.method,
                    req.context.get(STAFF_DEVLOG_REQUEST),
                ) ||
                req.url.endsWith("/auth/refresh") ||
                req.url.endsWith("/auth/login")
            )
                return throwError(() => err);

            return auth.refresh().pipe(
                switchMap(() => {
                    const token = auth.getAccessToken();
                    const retryReq = token
                        ? req.clone({
                              setHeaders: {
                                  Authorization: `Bearer ${token}`,
                              },
                          })
                        : req;
                    return next(retryReq);
                }),
                catchError((refreshErr) => throwError(() => refreshErr)),
            );
        }),
    );
};
